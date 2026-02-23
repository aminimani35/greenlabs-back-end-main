import { Body, Get, Post, Put, Delete, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiController } from '../../common/decorators/api-controller.decorator';
import { ApiResponse } from '../../common/interfaces/base-response.interface';
import { GetUserHandler } from './queries/get-user/get-user.handler';
import { GetUsersHandler } from './queries/get-users/get-users.handler';
import { CreateUserHandler } from './commands/create-user/create-user.handler';
import { UpdateUserHandler } from './commands/update-user/update-user.handler';
import { DeleteUserHandler } from './commands/delete-user/delete-user.handler';
import { CreateUserDto } from './commands/create-user/create-user.dto';
import { UpdateUserDto } from './commands/update-user/update-user.dto';
import { GetUserQuery } from './queries/get-user/get-user.query';
import { CreateUserCommand } from './commands/create-user/create-user.command';
import { UpdateUserCommand } from './commands/update-user/update-user.command';
import { DeleteUserCommand } from './commands/delete-user/delete-user.command';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@ApiController('users')
export class UsersController {
  constructor(
    private readonly getUserHandler: GetUserHandler,
    private readonly getUsersHandler: GetUsersHandler,
    private readonly createUserHandler: CreateUserHandler,
    private readonly updateUserHandler: UpdateUserHandler,
    private readonly deleteUserHandler: DeleteUserHandler,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
  })
  async getUsers() {
    const users = await this.getUsersHandler.handle();
    return ApiResponse.ok(users, 'Users retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'User retrieved successfully',
  })
  @SwaggerApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('id') id: string) {
    const query = new GetUserQuery(id);
    const user = await this.getUserHandler.handle(query);
    return ApiResponse.ok(user, 'User retrieved successfully');
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user with email and name',
  })
  @SwaggerApiResponse({ status: 201, description: 'User created successfully' })
  @SwaggerApiResponse({ status: 400, description: 'Invalid input data' })
  @SwaggerApiResponse({
    status: 409,
    description: 'User with this email already exists',
  })
  async createUser(@Body() dto: CreateUserDto) {
    const command = new CreateUserCommand(dto.email, dto.name);
    const user = await this.createUserHandler.handle(command);
    return ApiResponse.ok(user, 'User created successfully');
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Update user information by ID',
  })
  @SwaggerApiResponse({ status: 200, description: 'User updated successfully' })
  @SwaggerApiResponse({ status: 404, description: 'User not found' })
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const command = new UpdateUserCommand(id, dto.name, dto.email);
    const user = await this.updateUserHandler.handle(command);
    return ApiResponse.ok(user, 'User updated successfully');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', description: 'Delete a user by ID' })
  @SwaggerApiResponse({ status: 200, description: 'User deleted successfully' })
  @SwaggerApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') id: string) {
    const command = new DeleteUserCommand(id);
    await this.deleteUserHandler.handle(command);
    return ApiResponse.ok(null, 'User deleted successfully');
  }
}
