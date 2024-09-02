import fs from "fs-extra";
import { Product } from "../models/product";

const filePath = "./products.json";

export const readProducts = async (): Promise<Product[]> => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data).products;
};

export const writeProducts = async (products: Product[]): Promise<void> => {
  await fs.writeFile(filePath, JSON.stringify({ products }, null, 2));
};
