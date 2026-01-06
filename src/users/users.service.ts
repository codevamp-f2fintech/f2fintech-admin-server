import * as bcrypt from 'bcryptjs';
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
}
