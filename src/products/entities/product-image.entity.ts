import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  //Relación con la entidad Product y el campo images
  //Una imagen pertenece a un producto
  @ManyToOne(() => Product, (product) => product.images)
  product: Product;
}
