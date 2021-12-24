import * as express from "express";
// import { join } from 'path';
import * as multer from "multer";

import {
  getProducts,
  getProductById,
  createNewProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/product";
import isAuth from "../../middlewares/isAuth";


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "/bootcamp project/FikraCampV2/W5/public/images");
      // cb(null, path.join(__dirname, '..', '..', 'public', 'images'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]
      );
    },
  }),
});

const router = express.Router();

router.get("/:productId", getProductById);
router.delete("/:productId",isAuth, deleteProduct);

router.get("/", getProducts);

// router.use(express.json());
router.use(upload.single("image"));

router.post("/", isAuth,createNewProduct);
router.put("/:productId",isAuth, updateProduct);

export default router;
