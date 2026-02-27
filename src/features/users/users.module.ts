import { Module } from '@nestjs/common';
import { GetUserHandler } from './queries/get-user/get-user.handler';
import { GetUsersHandler } from './queries/get-users/get-users.handler';
import { CreateUserHandler } from './commands/create-user/create-user.handler';
import { UpdateUserHandler } from './commands/update-user/update-user.handler';
import { DeleteUserHandler } from './commands/delete-user/delete-user.handler';
import { UsersController } from './users.controller';
import { UserRepository } from './repositories/user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    // Repositories
    UserRepository,
    // Query Handlers
    GetUserHandler,
    GetUsersHandler,
    // Command Handlers
    CreateUserHandler,
    UpdateUserHandler,
    DeleteUserHandler,
  ],
  exports: [UserRepository],
})
export class UsersModule {}
