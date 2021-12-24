import * as express from "express";
import * as cors from "cors";
import { join } from "path";

// ! Danger
// ? Primary
// TODO make them smile :)
//* █████████████████████████████████████████████████████╗
//* Loads the environment variables from the .env file ██╣║
import { config } from "dotenv"; //*██╣║
//*                                                    ██╣║
config(); //*██╣║
//* █████████████████████████████████████████████████████╝

import isAuth from "./middlewares/isAuth";

import usersRoutes from "./user/routes/user";
import productsRoutes from "./product/routes/product";
import authenticationRoutes from "./auth/routes/";

import { Product } from "./product/models/product";
import { User } from "./user/models/user";

import { createConnection } from "typeorm";
import { createExpressServer } from "routing-controllers";
import { AuthController } from "./auth/routing-controller";

// create backend application
const app = express();

// const app = createExpressServer({
//   controllers: [AuthController], // we specify controllers we want to use
// });

// ! U can use the middleware anywhere inside the express app
app.use(cors());

// app.use(express.json())

// creates connection with the database
createConnection({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "fikraaa",
  entities: [Product, User],
  logger: "simple-console",
  logging: true,
  synchronize: true,
})
  .then((connection) => {
    app.use("/", authenticationRoutes);
    // we used express static middleware here to serve static files
    app.use("/images", express.static(join(__dirname, "public", "images")));

    // is a middleware for checking whether
    // the user is logged in or not
        app.use("/products", productsRoutes);

    app.use(isAuth);
    app.use("/users", usersRoutes);
    app.listen(5500, "localhost", () => {
      console.log("the server link is " + "http://localhost:5500");
    });
  })
  .catch((error) => console.log(error));
