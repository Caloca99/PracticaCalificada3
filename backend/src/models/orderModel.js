import { pool } from "../config/db.js";
import { getCartByUser, clearCart } from "./cartModel.js";

export async function createOrderFromCart(userId) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const cart = await getCartByUser(userId);

    if (cart.length === 0) {
      throw Object.assign(new Error("El carrito esta vacio"), { statusCode: 400 });
    }

    for (const item of cart) {
      if (item.quantity > item.stock) {
        throw Object.assign(
          new Error(`Stock insuficiente para ${item.name}`),
          { statusCode: 400 }
        );
      }
    }

    const total = cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    );

    const [orderResult] = await connection.query(
      "INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'paid')",
      [userId, total.toFixed(2)]
    );
    const orderId = orderResult.insertId;

    for (const item of cart) {
      await connection.query(
        "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
        [orderId, item.product_id, item.quantity, item.price]
      );

      const [stockResult] = await connection.query(
        "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?",
        [item.quantity, item.product_id, item.quantity]
      );

      if (stockResult.affectedRows === 0) {
        throw Object.assign(
          new Error(`Stock insuficiente para ${item.name}`),
          { statusCode: 400 }
        );
      }
    }

    await connection.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);

    await connection.commit();
    return { orderId, total: Number(total.toFixed(2)) };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function findOrdersByUser(userId) {
  const [orders] = await pool.query(
    `SELECT o.id, o.total, o.status, o.created_at,
            u.name AS user_name, u.email AS user_email
     FROM orders o
     INNER JOIN users u ON u.id = o.user_id
     WHERE o.user_id = ?
     ORDER BY o.id DESC`,
    [userId]
  );

  if (orders.length === 0) {
    return [];
  }

  const orderIds = orders.map((o) => o.id);
  const [items] = await pool.query(
    `SELECT oi.order_id, oi.quantity, oi.unit_price,
            p.id AS product_id, p.name AS product_name, p.image_url
     FROM order_items oi
     INNER JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id IN (?)`,
    [orderIds]
  );

  const itemsByOrder = items.reduce((acc, item) => {
    acc[item.order_id] = acc[item.order_id] || [];
    acc[item.order_id].push(item);
    return acc;
  }, {});

  return orders.map((order) => ({
    ...order,
    items: itemsByOrder[order.id] || []
  }));
}

export async function findAllOrders() {
  const [orders] = await pool.query(
    `SELECT o.id, o.total, o.status, o.created_at,
            u.name AS user_name, u.email AS user_email
     FROM orders o
     INNER JOIN users u ON u.id = o.user_id
     ORDER BY o.id DESC`
  );

  if (orders.length === 0) {
    return [];
  }

  const orderIds = orders.map((o) => o.id);
  const [items] = await pool.query(
    `SELECT oi.order_id, oi.quantity, oi.unit_price,
            p.id AS product_id, p.name AS product_name, p.image_url
     FROM order_items oi
     INNER JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id IN (?)`,
    [orderIds]
  );

  const itemsByOrder = items.reduce((acc, item) => {
    acc[item.order_id] = acc[item.order_id] || [];
    acc[item.order_id].push(item);
    return acc;
  }, {});

  return orders.map((order) => ({
    ...order,
    items: itemsByOrder[order.id] || []
  }));
}

export async function countOrders() {
  const [rows] = await pool.query("SELECT COUNT(*) AS total FROM orders");
  return rows[0].total;
}

export async function sumOrderTotals() {
  const [rows] = await pool.query("SELECT COALESCE(SUM(total), 0) AS total FROM orders");
  return Number(rows[0].total);
}
