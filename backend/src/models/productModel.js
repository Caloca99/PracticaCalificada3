import { pool } from "../config/db.js";

const productFields = "id, name, description, price, stock, image_url";

export async function findAllProducts() {
  const [rows] = await pool.query(
    `SELECT ${productFields} FROM products ORDER BY id DESC`
  );
  return rows;
}

export async function findProductById(id) {
  const [rows] = await pool.query(
    `SELECT ${productFields} FROM products WHERE id = ?`,
    [id]
  );
  return rows[0];
}

export async function createProduct(product) {
  const [result] = await pool.query(
    `INSERT INTO products (name, description, price, stock, image_url)
     VALUES (?, ?, ?, ?, ?)`,
    [
      product.name,
      product.description,
      product.price,
      product.stock,
      product.image_url
    ]
  );

  return findProductById(result.insertId);
}

export async function updateProduct(id, product) {
  const fields = Object.keys(product);
  const values = Object.values(product);

  if (fields.length === 0) {
    return findProductById(id);
  }

  const assignments = fields.map((field) => `${field} = ?`).join(", ");

  await pool.query(`UPDATE products SET ${assignments} WHERE id = ?`, [
    ...values,
    id
  ]);

  return findProductById(id);
}

export async function deleteProduct(id) {
  const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
