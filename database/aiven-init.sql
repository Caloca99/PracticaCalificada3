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

TRUNCATE TABLE products;

INSERT INTO products (name, description, price, stock, image_url) VALUES
('Proteina Whey 2 lb', 'Suplemento de proteina para recuperacion muscular despues del entrenamiento.', 139.90, 18, 'https://picsum.photos/seed/proteina-whey/600/400'),
('Mancuernas Ajustables', 'Par de mancuernas para rutinas de fuerza en casa o gimnasio.', 249.90, 8, 'https://picsum.photos/seed/mancuernas-gym/600/400'),
('Guantes de Entrenamiento', 'Guantes acolchados para mejorar agarre y proteger las manos.', 39.90, 30, 'https://picsum.photos/seed/guantes-fitness/600/400'),
('Shaker Deportivo', 'Botella mezcladora para proteinas, creatina y bebidas pre entreno.', 24.90, 45, 'https://picsum.photos/seed/shaker-gym/600/400'),
('Banda de Resistencia', 'Banda elastica ideal para calentamiento, movilidad y ejercicios funcionales.', 29.90, 25, 'https://picsum.photos/seed/banda-resistencia/600/400'),
('Creatina Monohidratada', 'Creatina para apoyar rendimiento, fuerza y volumen muscular.', 89.90, 14, 'https://picsum.photos/seed/creatina-gym/600/400');
