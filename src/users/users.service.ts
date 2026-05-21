import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User, Status } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

export interface PaginationResult<T> {
  results: T[];
  count: number;
  pages: number;
  errorMessage?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;
    const hashedPassword = await this.generateHashedPassword(password);

    try {
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return await this.userRepository.save(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Unique constraint violation
        throw new ConflictException(`Email ${email} already exists`);
      }
      throw new BadRequestException('User creation failed');
    }
  }

  private async generateHashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  // users.service.ts
  async login(loginUserDto: LoginUserDto): Promise<{
    access_token: string;
    userId: number;
    // companyId?: number;
    // companyName?: string;
    role: string;
  }> {
    const { email, password } = loginUserDto;

    // Include company relation in the query
    const user = await this.userRepository.findOne({
      where: {
        email,
        status: Status.ACTIVE
      },
      // relations: ['company'] // Make sure this relation exists
    });

    if (!user) {
      throw new UnauthorizedException('User Not Found or Inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }

    // console.log('User Company:', user, user.company);

    // Include company information in the JWT payload
    const payload = {
      username: user.username,
      id: user.id,
      role: user.role,
      email: user.email,
      source: 'oms',
      // companyId: user.company?.companyId, // Add company ID to payload
      // companyName: user.company?.name // Add company name to payload
    };

    const access_token = this.jwtService.sign(payload);

    // Return comprehensive response with company data
    return {
      access_token: access_token,
      userId: user.id,
      role: user.role,
      // companyId: user.company?.companyId,
      // companyName: user.company?.name,
    };
  }

  // users.service.ts
  async findAll(
    page: number,
    limit: number,
    status: Status = Status.ACTIVE,
    userRole?: string,
    // companyId?: string,
  ): Promise<PaginationResult<User>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.status = :status', { status });
    // .leftJoinAndSelect('user.company', 'company')

    // Apply companyId filter only for non-super-admin
    // if (userRole !== 'super admin') {
    //   if (!companyId) {
    //     throw new BadRequestException('Company ID is required');
    //   }

    //   const companyIdNum = Number(companyId);
    //   if (Number.isNaN(companyIdNum)) {
    //     throw new BadRequestException('Invalid companyId');
    //   }

    //   queryBuilder.andWhere('user.company_id = :companyId', { companyId: companyIdNum });
    // }

    const [results, count] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.updated_at', 'DESC')
      .getManyAndCount();

    // Transform results to include companyName at root level
    const transformedResults = results.map(user => ({
      ...user,
      // companyName: user.company?.name || null,
    }));

    return {
      results: transformedResults,
      count,
      pages: Math.ceil(count / limit),
    };
  }

  async findInactiveUsers(
    page: number,
    limit: number,
    // companyId?: string,
    userRole?: string,
  ): Promise<PaginationResult<User>> {
    return this.findAll(page, limit, Status.INACTIVE, userRole);
    // return this.findAll(page, limit, Status.INACTIVE, companyId, userRole);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User Not Found`);
    }
    return user;
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const { id, password, ...updateFields } = updateUserDto;
    // Ensure the user exists before updating
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User Not Found`);
    }
    // mutable updateData object
    const updateData: Partial<User> = { ...updateFields };
    if (password) {
      const hashedPassword = await this.generateHashedPassword(password);
      updateData.password = hashedPassword;
    }

    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email, status: Status.ACTIVE } });
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    // Use the user's current hashed password as part of the secret.
    // This ensures the token becomes invalid immediately after the password is changed!
    const secret = (process.env.RESET_PASSWORD_SECRET || 'fallback_reset_secret') + user.password;
    const expiresIn = process.env.RESET_PASSWORD_EXPIRY || '15m';
    
    const payload = { id: user.id, email: user.email };
    const resetToken = this.jwtService.sign(payload, { expiresIn, secret });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?role=employee&token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Support Team" <${process.env.SMTP_FROM_EMAIL}>`,
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please use the following link to reset your password: ${resetLink}`,
      html: `<p>You requested a password reset.</p><p>Please click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a><p>If you did not request this, please ignore this email.</p><p>This link will expire in 15 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    return { message: 'Password reset link sent to email successfully' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    let payload: any;
    try {
      // Decode the token without verifying signature first to extract the user ID
      payload = this.jwtService.decode(token);
      if (!payload || !payload.id) {
        throw new UnauthorizedException('Invalid token format');
      }
    } catch (e) {
      throw new UnauthorizedException('Invalid token format');
    }

    const user = await this.findOne(payload.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Reconstruct the unique secret to verify validity
    const secret = (process.env.RESET_PASSWORD_SECRET || 'fallback_reset_secret') + user.password;

    try {
      // Verify the token signature and expiration
      this.jwtService.verify(token, { secret });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired password reset token');
    }

    // Hash new password and update
    const hashedPassword = await this.generateHashedPassword(newPassword);
    await this.userRepository.update(user.id, { password: hashedPassword });

    return { message: 'Password updated successfully' };
  }
}
