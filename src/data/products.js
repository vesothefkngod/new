export const PRODUCTS = [
  { id: 'p1', title: 'Stealth Hoodie', short: 'Black / L', desc: 'Удобно urban облекло.', price: 59.00, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop' },
  { id: 'p2', title: 'Signal Blocker', short: 'Faraday Pouch', desc: 'Блокира RFID/NFC.', price: 29.00, image: 'https://images.unsplash.com/photo-1518444082617-7a3b2e7a4a36?q=80&w=1200&auto=format&fit=crop' },
  { id: 'p3', title: 'Hardware Wallet', short: 'Cold storage', desc: 'Сигурно съхранение.', price: 119.00, image: 'https://images.unsplash.com/photo-1621416894569-0f39f8fc5e51?q=80&w=1200&auto=format&fit=crop' }
];
export function getById(id){ return PRODUCTS.find(p=>p.id===id); }
