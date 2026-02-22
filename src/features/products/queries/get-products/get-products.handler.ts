import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/product.entity';
import { ProductRepository } from '../../repositories/product.repository';

@Injectable()
export class GetProductsHandler {
  constructor(private readonly productRepository: ProductRepository) {}

  async handle(): Promise<Product[]> {
    return await this.productRepository.findAll();
  }
}
