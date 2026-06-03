import {
  createProduct,
  deleteProduct,
  findAllProducts,
  findProductById,
  updateProduct
} from "../models/productModel.js";
import { getProductImage } from "../services/imageService.js";

export async function getProducts(_req, res, next) {
  try {
    const products = await findAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await findProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function postProduct(req, res, next) {
  try {
    const imageUrl = req.body.image_url || (await getProductImage(req.body.name));
    const product = await createProduct({
      ...req.body,
      image_url: imageUrl
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

export async function putProduct(req, res, next) {
  try {
    const currentProduct = await findProductById(req.params.id);

    if (!currentProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function removeProduct(req, res, next) {
  try {
    const deleted = await deleteProduct(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
