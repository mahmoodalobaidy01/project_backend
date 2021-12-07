import { EntitySchema } from "typeorm";
import { User } from "../models/user";

export default new EntitySchema({
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    name: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    age: {
      type: "tinyint",
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 512,
      nullable: false,
    },
    password: {
      type: "varchar",
      length: 70, // Qutaiba
      nullable: false,
    },
    privileges: {
      type: "tinyint", // Amina
      nullable: false,
    },
  },
  name: "user",
  target: User,
});
