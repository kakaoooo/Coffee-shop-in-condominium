// API Configuration
export const API_BASE = `http://${window.location.hostname}:5001/api`;
export const UPLOADS_BASE = `http://${window.location.hostname}:5001`;

// Payment Configuration
export const PROMPTPAY_NUMBER = "0918354757";
export const SHOP_NAME = "Brew & Go";

// Pricing
export const BEAN_EXTRA = 10;
export const MILK_EXTRA = 10;

// Unit Options for Delivery
export const UNIT_OPTIONS = ["Lobby", "9", ...Array.from({length:150},(_,i)=>`9/${i+1}`)];

// File Upload Constraints
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Polling interval for order status
export const ORDER_STATUS_POLL_INTERVAL = 3000; // 3 seconds
export const ORDER_COMPLETION_TIMEOUT = 10000; // 10 seconds before clearing
