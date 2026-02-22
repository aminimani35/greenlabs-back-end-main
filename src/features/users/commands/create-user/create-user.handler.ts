import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class CreateUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(command: CreateUserCommand): Promise<User> {
    // Business logic: Check if user already exists
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create the user
    const user = await this.userRepository.create({
      email: command.email,
      name: command.name,
    });

    return user;
  }
}
