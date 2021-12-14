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

    category: {
      type: "int",
      nullable: false,
    },
    catcategory: {
      type: "string",
      nullable: false,
    },
    description: {
      type: "string",
      nullable: false,
    },
  },
  name: "product",
  target: Product,
});
