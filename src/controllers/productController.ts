import { Request, Response } from "express";
import { readProducts, writeProducts } from "../utils/fileHandler";
import { Product } from "../models/product";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await readProducts();
    const { category } = req.query;

    const filteredProducts = products.filter((product) => !product.deleted);

    if (category) {
      const categoryFilteredProducts = filteredProducts.filter(
        (product) => product.category === category
      );
      res.json(categoryFilteredProducts);
    } else {
      res.json(filteredProducts);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await readProducts();
    const product = products.find((p) => p.id === req.params.id && !p.deleted);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newProduct: Product = req.body;

    if (newProduct.stock.available < 0 || newProduct.price <= 0) {
      res.status(400).json({ message: "Invalid stock or price" });
      return;
    }

    const products = await readProducts();
    products.push(newProduct);
    await writeProducts(products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProductStreet = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { street } = req.body;

    const products = await readProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (product.manufacturer && product.manufacturer.address) {
      product.manufacturer.address.street =
        street || product.manufacturer.address.street;
      await writeProducts(products);
      res.json(product);
    } else {
      res.status(400).json({ message: "Manufacturer or Address not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};

export const softDeleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const products = await readProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    product.deleted = true;
    await writeProducts(products);

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
