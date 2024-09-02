import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProductStreet,
  softDeleteProduct,
} from "../controllers/productController";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.patch("/products/:id/street", updateProductStreet);
router.delete("/products/:id", softDeleteProduct);

export default router;
