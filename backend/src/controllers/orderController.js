const db = require('../config/db');

// --- Customer APIs ---
exports.getProducts = (req, res) => {
  db.query('SELECT * FROM products WHERE is_active = TRUE', (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch products' });
    res.json(results);
  });
};

exports.createOrder = (req, res) => {
  console.log('📦 [ระบบ] กำลังรับออเดอร์ใหม่...');
  try {
    const { name, unit, note, items, total } = req.body;
    if (!name || !unit || !items || !total) return res.status(400).json({ error: 'ข้อมูลไม่ครบถ้วน' });

    const slipData = req.file ? `/uploads/${req.file.filename}` : null;
    if (!slipData) return res.status(400).json({ error: 'ไม่พบไฟล์รูปสลิป' });
    
    let parsedItems = [];
    try { parsedItems = JSON.parse(items); } catch(e) { return res.status(400).json({ error: 'ข้อมูลสินค้าผิดพลาด' }); }

    const sqlOrder = `INSERT INTO orders (customer_name, unit_number, note, total_amount, order_status, slip_data) VALUES (?, ?, ?, ?, 'pending', ?)`;
    
    db.query(sqlOrder, [name, unit, note || '', total, slipData], (dbErr, orderResult) => {
      if (dbErr) return res.status(500).json({ error: 'บันทึกออเดอร์ไม่สำเร็จ: ' + dbErr.message });
      
      const orderId = orderResult.insertId;
      const values = parsedItems.map((item) => [
        orderId, item.id, item.product_name || item.name || 'Unknown', item.quantity || item.qty || 1, item.price, item.bean || 'house', item.milk || 'fresh'
      ]);

      const sqlItems = `INSERT INTO order_items (order_id, product_id, product_name, quantity, price_at_time, bean_option, milk_option) VALUES ?`;
      db.query(sqlItems, [values], (dbErr2) => {
        if (dbErr2) return res.status(500).json({ error: 'บันทึกรายการสินค้าล้มเหลว' });
        console.log('🎉 [ออเดอร์สำเร็จ] รหัสออเดอร์:', orderId);
        res.json({ message: 'Success', orderId: orderId.toString() });
      });
    });
  } catch (criticalErr) {
    console.error('🚨 [ระบบพังรุนแรง]:', criticalErr);
    res.status(500).json({ error: 'ระบบทำงานผิดพลาด: ' + criticalErr.message });
  }
};

exports.getOrderById = (req, res) => {
  db.query('SELECT id, unit_number, order_status AS status FROM orders WHERE id = ?', [req.params.id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(results[0]);
  });
};

exports.updateSlip = (req, res) => {
  const slipData = req.file ? `/uploads/${req.file.filename}` : null;
  if (!slipData) return res.status(400).json({ error: 'ไม่พบไฟล์สลิปใหม่' });

  db.query("UPDATE orders SET slip_data = ?, order_status = 'pending' WHERE id = ?", [slipData, req.params.id], (dbErr) => {
    if (dbErr) return res.status(500).json({ error: 'อัปเดตสลิปล้มเหลว: ' + dbErr.message });
    res.json({ message: 'Slip updated successfully' });
  });
};

// --- Admin APIs ---
exports.getAdminOrders = (req, res) => {
  const sql = `SELECT o.id AS order_id, o.customer_name, o.unit_number, o.note, o.total_amount, o.order_status, o.slip_data, o.created_at, oi.product_id, oi.product_name, oi.quantity, oi.price_at_time, oi.bean_option, oi.milk_option FROM orders o JOIN order_items oi ON o.id = oi.order_id ORDER BY o.id DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Fetch failed' });
    const grouped = results.reduce((acc, row) => {
      const oid = row.order_id;
      if (!acc[oid]) {
        acc[oid] = { id: oid.toString(), name: row.customer_name, unit: row.unit_number, note: row.note, total: row.total_amount, status: row.order_status, slip: row.slip_data, time: row.created_at ? new Date(row.created_at).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }) : '', items: [] };
      }
      acc[oid].items.push({ id: row.product_id, product_name: row.product_name, quantity: row.quantity, price: row.price_at_time, bean: row.bean_option, milk: row.milk_option });
      return acc;
    }, {});
    res.json(Object.values(grouped));
  });
};

exports.updateOrderStatus = (req, res) => {
  db.query('UPDATE orders SET order_status = ? WHERE id = ?', [req.body.newStatus, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Status update failed' });
    res.json({ message: 'Success' });
  });
};

exports.deleteOrder = (req, res) => {
  db.query('DELETE FROM order_items WHERE order_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Item delete failed' });
    db.query('DELETE FROM orders WHERE id = ?', [req.params.id], (err2) => {
      if (err2) return res.status(500).json({ error: 'Order delete failed' });
      res.json({ message: 'Deleted' });
    });
  });
};