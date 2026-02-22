import { Injectable, NotFoundException } from '@nestjs/common';
import { GetUserQuery } from './get-user.query';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class GetUserHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(query: GetUserQuery): Promise<User> {
    const user = await this.userRepository.findById(query.userId);

    if (!user) {
      throw new NotFoundException(`User with ID ${query.userId} not found`);
    }

    return user;
  }
}
