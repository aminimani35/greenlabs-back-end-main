import { Module } from '@nestjs/common';
import { GetProductHandler } from './queries/get-product/get-product.handler';
import { GetProductsHandler } from './queries/get-products/get-products.handler';
import { CreateProductHandler } from './commands/create-product/create-product.handler';
import { ProductsController } from './products.controller';
import { ProductRepository } from './repositories/product.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    // Repositories
    ProductRepository,
    // Query Handlers
    GetProductHandler,
    GetProductsHandler,
    // Command Handlers
    CreateProductHandler,
  ],
  exports: [ProductRepository],
})
export class ProductsModule {}
