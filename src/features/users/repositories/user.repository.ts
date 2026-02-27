import { Injectable } from '@nestjs/common';
import { User } from '../domain/user.entity';

@Injectable()
export class UserRepository {
  // In-memory storage for demo purposes
  // Replace with actual database implementation (TypeORM, Prisma, etc.)
  private users: User[] = [];
  private idCounter = 1;

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = Object.assign(new User(), {
      id: (this.idCounter++).toString(),
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...userData,
      updatedAt: new Date(),
    };
    return this.users[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }
}
