import { Injectable } from '@nestjs/common';
import { CreateProductCommand } from './create-product.command';
import { Product } from '../../domain/product.entity';
import { ProductRepository } from '../../repositories/product.repository';

@Injectable()
export class CreateProductHandler {
  constructor(private readonly productRepository: ProductRepository) {}

  async handle(command: CreateProductCommand): Promise<Product> {
    const product = await this.productRepository.create({
      name: command.name,
      price: command.price,
      description: command.description,
    });

    return product;
  }
}
