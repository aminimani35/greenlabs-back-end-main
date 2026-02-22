import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserCommand } from './update-user.command';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UpdateUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(command: UpdateUserCommand): Promise<User> {
    const user = await this.userRepository.findById(command.userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${command.userId} not found`);
    }

    const updatedUser = await this.userRepository.update(command.userId, {
      name: command.name,
      email: command.email,
    });

    return updatedUser!;
  }
}
