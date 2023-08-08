import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('numeric', {
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
}
