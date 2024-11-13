import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';

@Controller('api/v1/')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  @Roles(Role.Admin)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.usersService.create(createUserDto);
      return ResponseFormatter.success(
        201,
        'User created successfully',
        newUser,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 400,
        error.message || 'User creation failed',
      );
    }
  }

  @Post('login')
  // @Roles(Role.Admin)
  // @Roles(Role.Sales)
  async login(@Body() loginUserDto: LoginUserDto) {
    console.log('loginUserDto', loginUserDto);
    try {
      const token = await this.usersService.login(loginUserDto);
      return ResponseFormatter.success(200, 'Login successful', { token });
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 401,
        error.message || 'Unauthorized',
      );
    }
  }

  @Get('get-users')
  @Roles(Role.Admin)
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return ResponseFormatter.success(
        200,
        'Users retrieved successfully',
        users,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }

  @Get('get-by-id/:id')
  @Roles(Role.Admin, Role.Sales)
  async findOne(@Param('id') id: number) {
    try {
      const user = await this.usersService.findOne(id);
      return ResponseFormatter.success(
        200,
        'User retrieved successfully',
        user,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 404,
        error.message || 'User not found',
      );
    }
  }
  @Patch('update-user/:id')
  @Roles(Role.Admin)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.usersService.update(+id, updateUserDto);
      return ResponseFormatter.success(
        200,
        'User updated successfully',
        updatedUser,
      );
    } catch (error) {
      return ResponseFormatter.error(
        error.status || 500,
        error.message || 'Internal server error',
      );
    }
  }
}
