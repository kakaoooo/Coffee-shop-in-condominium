-- ใช้ database
CREATE DATABASE IF NOT EXISTS coffee_shop;
USE coffee_shop;

-- ตาราง products (เหมือนเดิม ไม่ต้องเปลี่ยน)
CREATE TABLE IF NOT EXISTS products (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100) NOT NULL,
  price     DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- ตาราง orders (อัปเดต: เพิ่ม customer_name, unit_number, note, slip_data)
CREATE TABLE IF NOT EXISTS orders (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100)   NOT NULL,
  unit_number   VARCHAR(20)    NOT NULL,
  note          TEXT,
  total_amount  DECIMAL(10,2)  NOT NULL,
  order_status  ENUM('pending','preparing','delivering','completed','slip_rejected')
                DEFAULT 'pending',
  slip_data     LONGTEXT,      -- เก็บ base64 image string
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ตาราง order_items (อัปเดต: เพิ่ม product_name, milk_option, เปลี่ยน bean_option)
CREATE TABLE IF NOT EXISTS order_items (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  order_id       INT            NOT NULL,
  product_id     INT            NOT NULL,
  product_name   VARCHAR(100)   NOT NULL,
  quantity       INT            NOT NULL,
  price_at_time  DECIMAL(10,2)  NOT NULL,
  bean_option    VARCHAR(20)    DEFAULT 'house',   -- 'house' | 'light'
  milk_option    VARCHAR(20)    DEFAULT 'fresh',   -- 'fresh' | 'oat'
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ถ้ามี table orders เดิมอยู่แล้ว ให้รัน ALTER นี้แทน CREATE
-- ALTER TABLE orders
--   ADD COLUMN IF NOT EXISTS customer_name VARCHAR(100) NOT NULL DEFAULT '',
--   ADD COLUMN IF NOT EXISTS unit_number   VARCHAR(20)  NOT NULL DEFAULT '',
--   ADD COLUMN IF NOT EXISTS note          TEXT,
--   ADD COLUMN IF NOT EXISTS slip_data     LONGTEXT,
--   MODIFY COLUMN order_status ENUM('pending','preparing','delivering','completed','slip_rejected') DEFAULT 'pending';

-- ถ้ามี table order_items เดิมอยู่แล้ว ให้รัน ALTER นี้แทน CREATE
-- ALTER TABLE order_items
--   ADD COLUMN IF NOT EXISTS product_name  VARCHAR(100) NOT NULL DEFAULT '',
--   ADD COLUMN IF NOT EXISTS milk_option   VARCHAR(20)  DEFAULT 'fresh',
--   MODIFY COLUMN bean_option VARCHAR(20) DEFAULT 'house';