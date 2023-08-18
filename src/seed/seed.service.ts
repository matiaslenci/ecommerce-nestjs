import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed.data';

@Injectable()
export class SeedService {
  constructor(private readonly productsSrv: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();
    return 'Seed Executed';
  }

  private async insertNewProducts() {
    // eliminar todos los productos
    await this.productsSrv.deleteAllProducts();

    // obtener los productos de la lista
    const products = initialData.products;

    // creamos una lista de promesas para insertar cada producto
    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsSrv.create(product));
    });
    //Cuando se resuelvan todas las promesas

    // insertamos todos los productos
    await Promise.all(insertPromises);

    return true;
  }
}
