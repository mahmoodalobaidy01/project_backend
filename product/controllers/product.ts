import { Request, Response, NextFunction } from "express";

import model, { Product } from "../models/Product";
const {
  getProducts: getProductsModel,
  addProduct,
  getProductById: getProductByIdModel,
  deleteProduct: deleteProductModel,
  updateProduct: updateProductModel,
} = model;

function getProducts(req: Request, res: Response, next: NextFunction) {
  getProductsModel().then((products: Product[]) => res.json(products));
}

function getProductById(req: Request, res: Response, next: NextFunction) {
  getProductByIdModel(+req.params.productId).then(
    (product: Product | undefined) => {
      res.json(product ? product : { message: "No product found" });
    }
  );
}

function deleteProduct(req: Request, res: Response, next: NextFunction) {
  deleteProductModel(+req.params.productId).then((product) => {
    res.json(product);
  });
}

function createNewProduct(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    return res.status(400).json({ message: "No image provided" });
  }

  const body = req.body;

  if (!body.title)
    return res.status(400).json({ message: "Your title is required" });
  if (!body.category)
    return res.status(400).json({ message: "Your category is required" });
  if (body.title.length < 3)
    return res.status(400).json({ message: "Your title is too short" });
  if (!body.price)
    return res.status(400).json({ message: "Your price is required" });
  if (body.price < 0.99)
    return res.status(400).json({ message: "You price is too low" });
  if (!body.userId || isNaN(parseInt(body.userId)))
    return res.status(400).json({ message: "Not valid user id" });

  addProduct({
    ...body,
    imagePath: req.file.path.substring(req.file.path.indexOf("/images")),
  }).then((product: Product | { message: string }) => res.json(product));
}

function updateProduct(req: Request, res: Response, next: NextFunction) {
  const body = req.body;

  if (!body.title && !body.price)
    return res.status(400).json({ message: "No data provided" });
  if (body.title && body.title.length < 3)
    return res.status(400).json({ message: "Your title is too short" });
  if (body.price && body.price < 0.99)
    return res.status(400).json({ message: "You price is too low" });

  updateProductModel(+req.params.ProductId, body).then(
    (product: Product | undefined) =>
      res.json(product ? product : { message: "No product found" })
  );
}

export {
  getProducts,
  getProductById,
  createNewProduct,
  deleteProduct,
  updateProduct,
};
