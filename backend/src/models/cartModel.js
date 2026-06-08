import { pool } from "../config/db.js";

export async function getCartByUser(userId) {
  const [rows] = await pool.query(
    `SELECT ci.id, ci.product_id, ci.quantity,
            p.name, p.price, p.stock, p.image_url
     FROM cart_items ci
     INNER JOIN products p ON p.id = ci.product_id
     WHERE ci.user_id = ?
     ORDER BY ci.id DESC`,
    [userId]
  );
  return rows;
}

export async function findItemById(itemId, userId) {
  const [rows] = await pool.query(
    "SELECT id, product_id, quantity FROM cart_items WHERE id = ? AND user_id = ?",
    [itemId, userId]
  );
  return rows[0];
}

export async function addOrIncrementItem(userId, productId, quantity) {
  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
    [userId, productId, quantity]
  );
}

export async function updateItemQuantity(itemId, userId, quantity) {
  const [result] = await pool.query(
    "UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?",
    [quantity, itemId, userId]
  );
  return result.affectedRows > 0;
}

export async function removeItem(itemId, userId) {
  const [result] = await pool.query(
    "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
    [itemId, userId]
  );
  return result.affectedRows > 0;
}

export async function clearCart(userId) {
  await pool.query("DELETE FROM cart_items WHERE user_id = ?", [userId]);
}
