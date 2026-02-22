import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User full name',
    example: 'Jane Doe',
  })
  @IsString()
  @IsOptional()
  @MinLength(2)
  name?: string;

  @ApiPropertyOptional({
    description: 'User email address',
    example: 'jane.doe@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
