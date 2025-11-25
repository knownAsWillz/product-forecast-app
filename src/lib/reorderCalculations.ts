import { Product } from './mockData';

export interface ProductWithReorder extends Product {
  needsReorder: boolean;
  daysUntilStockout: number;
  reorderThreshold: number;
}

export function calculateReorderStatus(product: Product): ProductWithReorder {
  const dailySalesRate = product.average_sales_per_week / 7;
  const reorderThreshold = dailySalesRate * product.replenish_lead_time_days;
  const needsReorder = product.current_inventory < reorderThreshold;
  
  // Calculate days until stockout
  const daysUntilStockout = dailySalesRate > 0 
    ? Math.floor(product.current_inventory / dailySalesRate)
    : Infinity;
  
  return {
    ...product,
    needsReorder,
    daysUntilStockout,
    reorderThreshold: Math.round(reorderThreshold)
  };
}

export function processProducts(products: Product[]): ProductWithReorder[] {
  return products.map(calculateReorderStatus);
}

export interface DashboardSummary {
  totalProducts: number;
  productsNeedingReorder: number;
  averageLeadTime: number;
  criticalStockCount: number; // Products with less than 7 days until stockout
}

export function calculateSummary(products: ProductWithReorder[]): DashboardSummary {
  const totalProducts = products.length;
  const productsNeedingReorder = products.filter(p => p.needsReorder).length;
  const averageLeadTime = Math.round(
    products.reduce((sum, p) => sum + p.replenish_lead_time_days, 0) / totalProducts
  );
  const criticalStockCount = products.filter(
    p => p.daysUntilStockout < 7 && p.daysUntilStockout !== Infinity
  ).length;
  
  return {
    totalProducts,
    productsNeedingReorder,
    averageLeadTime,
    criticalStockCount
  };
}
