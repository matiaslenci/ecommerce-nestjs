import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './';

//Agregamos el decorador entity para declararlo como una tabla en nuestra db
@Entity()
export class Product {
  //Crea una columna con uuid autoincremental
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //Crea una columna de tipo texto y que cada elemento sea unico
  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  //Otra forma de definir el tipo
  //Es nullable porq acepta nulos
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    unique: true,
  })
  slug: string;

  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @Column({
    type: 'text',
    array: true,
  })
  sizes: string[];

  @Column({
    type: 'text',
  })
  gender: string;

  //otra forma de definir el tipo
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  //Relacion de uno a muchos
  //El producto puede tener muchas imagenes
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
  })
  images?: ProductImage;

  /**
   * Se ejecuta antes de crear un producto en la tabla
   */
  @BeforeInsert()
  checkSlugInser() {
    //Si no existe el slug lo crea con el titulo del producto
    //Eliminamos los espacios y los apostrofes de la cadena
    //Lo pasamos a minusculas y lo guardamos en el slug del producto.
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  /**
   *  Se ejecuta antes de actualizar un producto en la tabla
   */
  @BeforeUpdate()
  checkSlugUpdate() {
    //El slug no puede tener espacios en blanco
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
