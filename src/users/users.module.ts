import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret:
        '3a1b7a6f3d4f456c8b7dbe3b6a1e0f4c7e9e2d3b5a8e4c2d9f1c0e1f3b5a6c7d', // Use environment variables in a real application
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
