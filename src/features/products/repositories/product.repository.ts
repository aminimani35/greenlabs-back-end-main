import { Injectable } from '@nestjs/common';
import { Product } from '../domain/product.entity';

@Injectable()
export class ProductRepository {
  private products: Product[] = [];
  private idCounter = 1;

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find((product) => product.id === id) || null;
  }

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = Object.assign(new Product(), {
      id: (this.idCounter++).toString(),
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    this.products.push(newProduct);
    return newProduct;
  }
}
