export const API_BASE = `http://${window.location.hostname}:5001/api`;
export const UPLOADS_BASE = `http://${window.location.hostname}:5001`;

export const BEAN_EXTRA = 10;
export const MILK_EXTRA = 10;
export const PROMPTPAY_NUMBER = "0918354757";
export const SHOP_NAME = "Brew & Go";
export const UNIT_OPTIONS = ["Lobby", "9", ...Array.from({ length: 150 }, (_, i) => `9/${i + 1}`)];

export const STATUS_INFO = (t) => ({
  pending: { label: t.statusPending, dot: "var(--status-new-dot)", bg: "var(--status-new-bg)", fg: "var(--status-new-fg)" },
  preparing: { label: t.statusPreparing, dot: "var(--status-prepare-dot)", bg: "var(--status-prepare-bg)", fg: "var(--status-prepare-fg)" },
  delivering: { label: t.statusDelivering, dot: "var(--status-serve-dot)", bg: "var(--status-serve-bg)", fg: "var(--status-serve-fg)" },
  completed: { label: t.statusCompleted, dot: "var(--status-completed-dot)", bg: "var(--status-completed-bg)", fg: "var(--status-completed-fg)" },
  slip_rejected: { label: t.statusRejected, dot: "var(--status-rejected-dot)", bg: "var(--status-rejected-bg)", fg: "var(--status-rejected-fg)" },
});

// PromptPay QR Generator Utils
function crc16(s) {
  let c = 0xFFFF;
  for (let i = 0; i < s.length; i++) {
    c ^= s.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) c = (c & 0x8000) ? ((c << 1) ^ 0x1021) & 0xFFFF : (c << 1) & 0xFFFF;
  }
  return c.toString(16).toUpperCase().padStart(4, "0");
}
function tlv(id, v) { return id + v.length.toString().padStart(2, "0") + v; }

export function buildQR(phone, amount) {
  const n = phone.replace(/\D/g, "").replace(/^0/, "0066");
  const body = [tlv("00", "01"), tlv("01", "12"), tlv("29", tlv("00", "A000000677010111") + tlv("01", n)), tlv("53", "764"), ...(amount > 0 ? [tlv("54", amount.toFixed(2))] : []), tlv("58", "TH"), "6304"].join("");
  return body + crc16(body);
}
