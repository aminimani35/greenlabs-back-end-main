import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class GetUsersHandler {
  constructor(private readonly userRepository: UserRepository) {}

  async handle(): Promise<User[]> {
    // Implement pagination if needed
    return await this.userRepository.findAll();
  }
}
