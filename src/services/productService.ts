import { Product } from "../models/product";
import { readProducts, writeProducts } from "../utils/fileHandler";

export const getAllProducts = async (category?: string): Promise<Product[]> => {
  const products = await readProducts();
  return products.filter(
    (product) =>
      !product.deleted && (!category || product.category === category)
  );
};

export const getProductById = async (
  id: string
): Promise<Product | undefined> => {
  const products = await readProducts();
  return products.find((product) => product.id === id && !product.deleted);
};

export const createProduct = async (newProduct: Product): Promise<void> => {
  const products = await readProducts();
  products.push(newProduct);
  await writeProducts(products);
};

export const updateProduct = async (
  id: string,
  updates: Partial<Product>
): Promise<void> => {
  const products = await readProducts();
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex !== -1) {
    const updatedProduct = { ...products[productIndex], ...updates };
    products[productIndex] = updatedProduct;
    await writeProducts(products);
  }
};

export const softDeleteProduct = async (id: string): Promise<void> => {
  const products = await readProducts();
  const productIndex = products.findIndex((product) => product.id === id);

  if (productIndex !== -1) {
    products[productIndex].deleted = true;
    await writeProducts(products);
  }
};
