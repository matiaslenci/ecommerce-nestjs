import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number) // enableImplicitConversions: true
  limit?: number; // Limite de productos que debe traer

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number; // Trae los productos apartir del producto n°...
}
