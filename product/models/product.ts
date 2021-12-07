import { join } from "path";
import { existsSync, unlinkSync } from "fs";
import {
  DeleteResult,
  getRepository,
  Repository,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne /* Like */,
} from "typeorm";
import userModel, { User } from "../../user/models/user";

@Entity({})
export class Product {
  @PrimaryGeneratedColumn({})
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column()
  price!: number;

  @Column({ length: 255 })
  imagePath!: string;

  @ManyToOne((type) => User, (user) => user.products, {
    nullable: false,
  })
  user!: number;

  @Column({ length: 255 })
  category!: string;
}

const productService = () => {
  async function addProduct(
    value: {
      title: string;
      price: number;
      imagePath: string;
      userId: number;
      category: string;
    },
    productRepository: Repository<Product> = getRepository("Product")
  ): Promise<Product | { message: string }> {
    if (!userModel.getUserById(value.userId))
      return { message: "User not found" };
    const product = new Product();
    product.title = value.title;
    product.price = value.price;
    product.imagePath = value.imagePath;
    product.user = value.userId;
    product.category = value.category;
    return await productRepository.save(product);
  }

  const getProducts = async (
    productRepository: Repository<Product> = getRepository("Product")
  ) =>
    await productRepository.find({
      select: ["id", "title", "price", "imagePath", "user", "category"],
      // where: {
      //     price:20
      // },
      take: 10,
      skip: 0,
    });
  const getProductById = async (
    id: number,
    productRepository: Repository<Product> = getRepository("Product")
  ) => await productRepository.findOne(id);
  const deleteProduct = async (
    id: number,
    productRepository: Repository<Product> = getRepository("Product")
  ): Promise<DeleteResult | undefined> => {
    const product = await productRepository.findOne(id);
    if (!product) return undefined;
    // let haveError = false;
    try {
      const path = join("S:", product.imagePath);
      // process.cwd(), "public",

      console.log(path);
      if (existsSync(path)) unlinkSync(path);
      console.log("delteing");

      // S:\bootcamp project\FikraCampV2\W5\public\bootcamp project\FikraCampV2\W5\public\images\image-1637676609044-205784276.png
      // S:\bootcamp project\FikraCampV2\W5\public\images\image-1637676747381-223558349.png

      return await productRepository.delete(id);
    } catch (error) {
      return undefined;
    }
  };
  const updateProduct = async (
    id: number,
    updatedProduct: {
      title: string;
      price: number;
    },
    productRepository: Repository<Product> = getRepository("Product")
  ): Promise<Product | undefined> => {
    const product = await getProductById(id);
    if (!product) return undefined;
    if (updatedProduct.title) product!.title = updatedProduct.title;
    if (updatedProduct.price) product!.price = updatedProduct.price;
    return await productRepository.save(product!);
  };

  return {
    addProduct,
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
  };
};

export default productService();