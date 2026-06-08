import { createOrderFromCart, findAllOrders, findOrdersByUser } from "../models/orderModel.js";

export async function checkout(req, res, next) {
  try {
    const { address, phone } = req.body;
    const { orderId, total } = await createOrderFromCart(req.session.user.id);
    res.status(201).json({
      message: "Compra realizada con exito",
      order: { id: orderId, total, address, phone }
    });
  } catch (error) {
    next(error);
  }
}

export async function myOrders(req, res, next) {
  try {
    const orders = await findOrdersByUser(req.session.user.id);
    res.json({ orders });
  } catch (error) {
    next(error);
  }
}

export async function listOrders(_req, res, next) {
  try {
    const orders = await findAllOrders();
    res.json({ orders });
  } catch (error) {
    next(error);
  }
}
