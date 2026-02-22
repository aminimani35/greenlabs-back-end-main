import { BaseEntity } from '../../../common/interfaces/base-entity.interface';

export class Product implements BaseEntity {
  id: string;
  name: string;
  price: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
