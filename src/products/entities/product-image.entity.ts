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
  //Y un producto puede tener muchas imagenes
  //Borra todas las imagenes de un producto cuando se borra el producto
  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
