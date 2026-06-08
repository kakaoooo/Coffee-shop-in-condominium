const { SECRET_TOKEN } = require('../middlewares/auth');

// fetch ADMIN_PASSWORD from .env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

exports.login = (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    res.json({ success: true, token: SECRET_TOKEN });
  } else {
    res.status(401).json({ error: 'รหัสผ่านไม่ถูกต้อง!' });
  }
};