import { Injectable, NotFoundException } from '@nestjs/common';
import { GetProductQuery } from './get-product.query';
import { Product } from '../../domain/product.entity';
import { ProductRepository } from '../../repositories/product.repository';

@Injectable()
export class GetProductHandler {
  constructor(private readonly productRepository: ProductRepository) {}

  async handle(query: GetProductQuery): Promise<Product> {
    const product = await this.productRepository.findById(query.productId);

    if (!product) {
      throw new NotFoundException(
        `Product with ID ${query.productId} not found`,
      );
    }

    return product;
  }
}
