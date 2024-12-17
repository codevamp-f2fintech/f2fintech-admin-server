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
  ): Promise<PaginationResult<User>> {
    const [results, count] = await this.userRepository.findAndCount({
      where: { status: Status.ACTIVE },
      skip: (page - 1) * limit,
      take: limit,
      order: { updated_at: 'DESC' },
    });
    return {
      results,
      count,
      pages: Math.ceil(count / limit),
    };
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
