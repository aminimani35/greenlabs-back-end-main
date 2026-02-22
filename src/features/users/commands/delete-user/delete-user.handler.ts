import { Injectable, NotFoundException } from '@nestjs/common';
import { DeleteUserCommand } from './delete-user.command';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class DeleteUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(command: DeleteUserCommand): Promise<void> {
    const deleted = await this.userRepository.delete(command.userId);

    if (!deleted) {
      throw new NotFoundException(`User with ID ${command.userId} not found`);
    }
  }
}
