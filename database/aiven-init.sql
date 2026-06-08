CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_user_product (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'paid', 'shipped', 'cancelled') NOT NULL DEFAULT 'paid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

TRUNCATE TABLE products;

INSERT INTO products (name, description, price, stock, image_url) VALUES
('Proteina Whey 2 lb', 'Suplemento de proteina para recuperacion muscular despues del entrenamiento.', 139.90, 18, 'https://picsum.photos/seed/proteina-whey/600/400'),
('Mancuernas Ajustables', 'Par de mancuernas para rutinas de fuerza en casa o gimnasio.', 249.90, 8, 'https://picsum.photos/seed/mancuernas-gym/600/400'),
('Guantes de Entrenamiento', 'Guantes acolchados para mejorar agarre y proteger las manos.', 39.90, 30, 'https://picsum.photos/seed/guantes-fitness/600/400'),
('Shaker Deportivo', 'Botella mezcladora para proteinas, creatina y bebidas pre entreno.', 24.90, 45, 'https://picsum.photos/seed/shaker-gym/600/400'),
('Banda de Resistencia', 'Banda elastica ideal para calentamiento, movilidad y ejercicios funcionales.', 29.90, 25, 'https://picsum.photos/seed/banda-resistencia/600/400'),
('Creatina Monohidratada', 'Creatina para apoyar rendimiento, fuerza y volumen muscular.', 89.90, 14, 'https://picsum.photos/seed/creatina-gym/600/400');
