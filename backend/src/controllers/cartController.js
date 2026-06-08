import {
  addOrIncrementItem,
  clearCart,
  findItemById,
  getCartByUser,
  removeItem,
  updateItemQuantity
} from "../models/cartModel.js";
import { findProductById } from "../models/productModel.js";

export async function getCart(req, res, next) {
  try {
    const items = await getCartByUser(req.session.user.id);
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

export async function addItem(req, res, next) {
  try {
    const { product_id, quantity } = req.body;
    const product = await findProductById(product_id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (product.stock < quantity) {
      return res
        .status(400)
        .json({ message: `Stock insuficiente. Disponible: ${product.stock}` });
    }

    await addOrIncrementItem(req.session.user.id, product_id, quantity);
    const items = await getCartByUser(req.session.user.id);
    res.status(201).json({ items });
  } catch (error) {
    next(error);
  }
}

export async function updateItem(req, res, next) {
  try {
    const itemId = Number(req.params.id);
    const { quantity } = req.body;

    const item = await findItemById(itemId, req.session.user.id);
    if (!item) {
      return res.status(404).json({ message: "Item no encontrado en el carrito" });
    }

    const product = await findProductById(item.product_id);
    if (!product || product.stock < quantity) {
      return res
        .status(400)
        .json({ message: `Stock insuficiente. Disponible: ${product?.stock ?? 0}` });
    }

    await updateItemQuantity(itemId, req.session.user.id, quantity);
    const items = await getCartByUser(req.session.user.id);
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

export async function deleteItem(req, res, next) {
  try {
    const itemId = Number(req.params.id);
    const removed = await removeItem(itemId, req.session.user.id);
    if (!removed) {
      return res.status(404).json({ message: "Item no encontrado en el carrito" });
    }
    const items = await getCartByUser(req.session.user.id);
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

export async function emptyCart(_req, res, next) {
  try {
    await clearCart(_req.session.user.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
