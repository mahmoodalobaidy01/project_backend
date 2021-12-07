import { EntitySchema } from "typeorm";
import { Product } from "../models/product";

export default new EntitySchema({
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    title: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    price: {
      type: "float",
      nullable: false,
    },
    imagePath: {
      type: "varchar",
      nullable: false,
    },
    userId: {
      type: "int",
      nullable: false,
    },
    category: {
      type: "int",
      nullable: false,
    },
  },
  name: "product",
  target: Product,
});
