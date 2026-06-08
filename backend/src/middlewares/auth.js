// recive SECRET_TOKEN from .env
const SECRET_TOKEN = process.env.SECRET_TOKEN;

const requireAuth = (req, res, next) => {
  if (req.headers.authorization === SECRET_TOKEN) next();
  else res.status(403).json({ error: 'ไม่อนุญาตให้เข้าถึงข้อมูล' });
};

module.exports = { requireAuth, SECRET_TOKEN };