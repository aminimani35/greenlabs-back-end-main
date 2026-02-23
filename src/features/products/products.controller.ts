import { Body, Get, Post, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiController } from '../../common/decorators/api-controller.decorator';
import { ApiResponse } from '../../common/interfaces/base-response.interface';
import { GetProductHandler } from './queries/get-product/get-product.handler';
import { GetProductsHandler } from './queries/get-products/get-products.handler';
import { CreateProductHandler } from './commands/create-product/create-product.handler';
import { CreateProductDto } from './commands/create-product/create-product.dto';
import { GetProductQuery } from './queries/get-product/get-product.query';
import { CreateProductCommand } from './commands/create-product/create-product.command';

@ApiTags('Products')
@ApiBearerAuth('JWT-auth')
@ApiController('products')
export class ProductsController {
  constructor(
    private readonly getProductHandler: GetProductHandler,
    private readonly getProductsHandler: GetProductsHandler,
    private readonly createProductHandler: CreateProductHandler,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve a list of all products',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
  })
  async getProducts() {
    const products = await this.getProductsHandler.handle();
    return ApiResponse.ok(products, 'Products retrieved successfully');
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a specific product by its ID',
  })
  @SwaggerApiResponse({
    status: 200,
    description: 'Product retrieved successfully',
  })
  @SwaggerApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('id') id: string) {
    const query = new GetProductQuery(id);
    const product = await this.getProductHandler.handle(query);
    return ApiResponse.ok(product, 'Product retrieved successfully');
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
    description:
      'Create a new product with name, price, and optional description',
  })
  @SwaggerApiResponse({
    status: 201,
    description: 'Product created successfully',
  })
  @SwaggerApiResponse({ status: 400, description: 'Invalid input data' })
  async createProduct(@Body() dto: CreateProductDto) {
    const command = new CreateProductCommand(
      dto.name,
      dto.price,
      dto.description,
    );
    const product = await this.createProductHandler.handle(command);
    return ApiResponse.ok(product, 'Product created successfully');
  }
}
