import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  BadRequestException,
  Headers
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResponseFormatter } from 'src/common/utility/responseFormatter';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Status } from './entities/user.entity';
// import { Roles } from 'src/common/decorators/roles.decorator';
// import { Role } from 'src/common/enum/role.enum';

@Controller( 'api/v1' )
@UseGuards( RolesGuard )
export class UsersController {
  constructor ( private readonly usersService: UsersService ) { }

  @Post( 'create-user' )
  async create ( @Body() createUserDto: CreateUserDto ) {
    const newUser = await this.usersService.create( createUserDto );
    return ResponseFormatter.success( 201, 'User Created Successfully', newUser );
  }

  @Post( 'login' )
  async login ( @Body() loginUserDto: LoginUserDto ) {
    const token = await this.usersService.login( loginUserDto );
    return ResponseFormatter.success( 200, 'Login Successful', token );
  }

  @Get( 'get-users' )
  async findAll (
    @Query( 'page' ) page: number,
    @Query( 'limit' ) limit: number,
    @Query( 'status' ) status: Status = Status.ACTIVE,
    @Headers( 'userrole' ) userRole?: string,
    // @Headers( 'companyid' ) companyIdString?: string,
  ): Promise<any> {
    // console.log( 'Headers - companyId:', companyIdString, 'userRole:', userRole );

    // If NOT super admin → companyId is required
    // if ( userRole !== 'super admin' )
    // {
    //   if ( !companyIdString )
    //   {
    //     throw new BadRequestException( 'Company ID is required' );
    //   }
    // }

    const users = await this.usersService.findAll(
      page,
      limit,
      status,
      userRole
      // companyIdString,
    );

    return ResponseFormatter.success(
      200,
      'Users Retrieved Successfully',
      users,
    );
  }


  @Get( 'get-inactive-users' )
  async findInactiveUsers (
    @Query( 'page' ) page: number,
    @Query( 'limit' ) limit: number,
    // @Headers( 'companyid' ) companyId: string,
    @Headers( 'userrole' ) userRole?: string,
  ): Promise<any> {
    // console.log( 'Headers - companyId:', companyId, 'userRole:', userRole );
    // if ( !companyId && userRole !== 'super admin' )
    // {
    //   throw new BadRequestException( 'Company ID is required' );
    // }
    const users = await this.usersService.findAll( page, limit, Status.INACTIVE, userRole );
    return ResponseFormatter.success( 200, 'Inactive Users Retrieved Successfully', users );
  }

  @Get( 'get-user-by-id/:id' )
  async findOne ( @Param( 'id' ) id: number ) {
    const user = await this.usersService.findOne( id );
    return ResponseFormatter.success( 200, 'User Retrieved Successfully', user );
  }

  @Patch( 'update-user' )
  async update ( @Body() updateUserDto: UpdateUserDto ) {
    const updatedUser = await this.usersService.update( updateUserDto );
    return ResponseFormatter.success( 200, 'User Updated Successfully', updatedUser );
  }
}
