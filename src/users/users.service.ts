import * as bcrypt from 'bcryptjs';

import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { Status, User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const { password, email } = createUserDto;
    const hashedPassword = await this.generateHashedPassword(password);

    try {
      const user = await this.userRepository.save({
        ...createUserDto,
        password: hashedPassword,
      });

      return ResponseFormatter.success(201, 'User created successfully', user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Unique constraint violation
        throw new ConflictException(
          ResponseFormatter.error(500, `Email ${email} already exists`),
        );
      }
      throw error; // Re-throw any other errors
    }
  }

  private async generateHashedPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async login(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User Not Found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }
    const payload = {
      username: user.username,
      id: user.id,
      role: user.role,
    };

    const access_token = {
      access_token: this.jwtService.sign(payload),
    };
    return access_token;
  }

  async findAll(
    page: number,
    limit: number
  ): Promise<{
    results: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    // Fetch paginated results
    const [results, total] = await Promise.all([
      this.userRepository.find({
        where: { status: Status.ACTIVE }, // Fetch users with active status
        skip,                             // Offset for pagination
        take: limit,                      // Limit for pagination
      }),
      this.userRepository.count({
        where: {
          status: Status.ACTIVE, // Count users where status is active
        }
      })
    ]);

    return {
      results,                       // The paginated results
      total,                         // The total number of documents
      page,                          // Current page
      limit,                         // Limit per page
      totalPages: Math.ceil(total / limit), // Calculate total pages
    };
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const { id, password, ...updateFields } = updateUserDto;
    // Ensure the user exists before updating
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // mutable updateData object
    const updateData: Partial<User> = { ...updateFields };
    // Hash the password if it's provided in the payload
    if (password) {
      const hashedPassword = await this.generateHashedPassword(password);
      updateData.password = hashedPassword;
    }

    // Update the user with the provided fields
    await this.userRepository.update(id, updateData);
    // Fetch and return the updated user
    return this.findOne(id);
  }
}
