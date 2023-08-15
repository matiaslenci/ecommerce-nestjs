import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    // Inyectamos el datasource para poder hacer las consultas a la base de datos
    private readonly dataSrc: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // Desestructuramos la propiedad images
      // si no viene ninguna imagen la creamos con un array vacio
      const { images = [], ...productDetails } = createProductDto;

      //Crea nuestra instancia del producto con nuestra propiedades
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });

      //Lo guardamos en la base de datos
      await this.productRepository.save(product);

      return { ...product, images };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    //Desestructura los valores del Dto y si no vienen toma por defecto los valores que le indico
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      //Relaciones que queremos traer para hacer un get
      relations: {
        images: true,
      },
    });

    // Retornamos el producto y para no devolver el id de las img solo devuelvo la url
    return products.map((product) => ({
      ...product,
      images: product.images.map((image) => image.url),
    }));
  }

  /**
   *
   * Busca un producto de la db
   *
   * @param term slug - titulo - uuid
   * @returns product que busca
   */
  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      product = await queryBuilder

        .where('LOWER(title) =:title or slug =:slug', {
          title: term.toLowerCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('product.images', 'images')
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`El producto ${term} no fue encontrado`);

    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);

    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    // Desestructuramos la propiedad images y la resto del objeto que nos llega
    const { images, ...toUpdate } = updateProductDto;

    // preload nos permite hacer una consulta a la base de datos para ver si existe el producto
    const product = await this.productRepository.preload({
      id,
      ...toUpdate,
    });

    if (!product)
      throw new NotFoundException(`Producto con id: ${id} no encontrado`);

    // Create query runner para actualizar el producto
    const queryRunner = this.dataSrc.createQueryRunner();

    // Conectamos con la base de datos
    await queryRunner.connect();
    // Iniciamos la transaccion
    await queryRunner.startTransaction();

    try {
      // Si viene una nueva imagen la agregamos a la coleccion de imagenes del producto
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        // Creamos una nueva coleccion de imagenes
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      // Guardamos el producto
      await queryRunner.manager.save(product);

      // Commit de la transaccion
      await queryRunner.commitTransaction();

      // Desconectamos de la base de datos
      await queryRunner.release();

      // Retornamos el producto con el id
      return product;
      //👇 Para que no retorne el id del producto
      //* return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);
    return `producto ${id} eliminado correctamente`;
  }

  private handleDBExceptions(error: any) {
    //Key duplicada no se puede crear otro elemento con el mismo nombre
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Error inesperado, revise los serves logs',
    );
  }
}
