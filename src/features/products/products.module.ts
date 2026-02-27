import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetProductHandler } from './queries/get-product/get-product.handler';
import { GetProductsHandler } from './queries/get-products/get-products.handler';
import { CreateProductHandler } from './commands/create-product/create-product.handler';
import { ProductsController } from './products.controller';
import { LicenseController } from './controllers/license.controller';
import { ProductRepository } from './repositories/product.repository';
import { LicenseService } from './services/license.service';
import { Product } from './domain/product.entity';
import { License } from './domain/license.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, License])],
  controllers: [ProductsController, LicenseController],
  providers: [
    // Repositories
    ProductRepository,
    // Services
    LicenseService,
    // Query Handlers
    GetProductHandler,
    GetProductsHandler,
    // Command Handlers
    CreateProductHandler,
  ],
  exports: [ProductRepository, LicenseService],
})
export class ProductsModule {}
