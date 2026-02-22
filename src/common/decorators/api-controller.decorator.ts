import { Controller, applyDecorators } from '@nestjs/common';

export function ApiController(prefix: string) {
  return applyDecorators(
    Controller(prefix),
    // Add more decorators here as needed (e.g., @ApiTags for Swagger)
  );
}
