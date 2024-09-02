import request from "supertest";
import app from "../../src/server";
import { readProducts, writeProducts } from "../../src/utils/fileHandler";
import { Product } from "../../src/models/product";

jest.mock("../../src/utils/fileHandler");

describe("Product Controller", () => {
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Test Product",
      description: "Description of Test Product",
      price: 100,
      category: "Test Category",
      stock: {
        available: 50,
        reserved: 5,
        location: "Test Location",
      },
      tags: ["tag1", "tag2"],
      rating: 4.5,
      deleted: false,
      manufacturer: {
        name: "Test Manufacturer",
        address: {
          street: "Old Street",
          city: "Test City",
          state: "Test State",
          zipCode: "12345",
        },
      },
    },
  ];

  beforeEach(() => {
    (readProducts as jest.Mock).mockResolvedValue(mockProducts);
    (writeProducts as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get all products", async () => {
    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockProducts[0]]);
  });

  it("should get a product by ID", async () => {
    const response = await request(app).get("/products/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockProducts[0]);
  });

  it("should return 404 if product not found", async () => {
    const response = await request(app).get("/products/999");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
  });

  it("should update the street of the manufacturer address", async () => {
    const newStreet = "New Street";
    const response = await request(app)
      .patch("/products/1/street")
      .send({ street: newStreet });

    expect(response.status).toBe(200);
    expect(response.body.manufacturer.address.street).toBe(newStreet);
  });

  it("should return 400 if manufacturer or address not found", async () => {
    const invalidProduct = { ...mockProducts[0], manufacturer: undefined };
    (readProducts as jest.Mock).mockResolvedValue([invalidProduct]);

    const response = await request(app)
      .patch("/products/1/street")
      .send({ street: "New Street" });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Manufacturer or Address not found");
  });

  it("should soft delete a product", async () => {
    const response = await request(app).delete("/products/1");

    expect(response.status).toBe(204);
    expect(mockProducts[0].deleted).toBe(true);
  });
});
