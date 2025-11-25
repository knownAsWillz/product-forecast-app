export interface Product {
  id: string;
  product_name: string;
  current_inventory: number;
  average_sales_per_week: number;
  replenish_lead_time_days: number;
}

const productCategories = [
  'Electronics', 'Clothing', 'Food & Beverage', 'Home & Garden', 
  'Sports', 'Books', 'Toys', 'Beauty', 'Automotive', 'Office Supplies'
];

const productNames = [
  'Premium', 'Deluxe', 'Essential', 'Professional', 'Ultra', 'Classic',
  'Modern', 'Eco-Friendly', 'Smart', 'Wireless', 'Digital', 'Organic'
];

const productTypes = [
  'Widget', 'Gadget', 'Tool', 'Kit', 'Set', 'Pack', 'Bundle', 
  'Collection', 'Series', 'System', 'Device', 'Accessory'
];

function generateProductName(): string {
  const category = productCategories[Math.floor(Math.random() * productCategories.length)];
  const name = productNames[Math.floor(Math.random() * productNames.length)];
  const type = productTypes[Math.floor(Math.random() * productTypes.length)];
  return `${name} ${category} ${type}`;
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockProducts(count: number = 100): Product[] {
  const products: Product[] = [];
  
  for (let i = 1; i <= count; i++) {
    products.push({
      id: `PROD-${String(i).padStart(4, '0')}`,
      product_name: generateProductName(),
      current_inventory: randomInt(0, 500),
      average_sales_per_week: randomInt(10, 200),
      replenish_lead_time_days: randomInt(3, 30)
    });
  }
  
  return products;
}

// Simulate API delay
export async function fetchProducts(): Promise<Product[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockProducts(120)); // Generate 120 products
    }, 500);
  });
}
