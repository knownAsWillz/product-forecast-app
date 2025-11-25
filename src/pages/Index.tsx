import { useEffect, useState } from 'react';
import { Package, AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import { fetchProducts } from '@/lib/mockData';
import { processProducts, calculateSummary, ProductWithReorder } from '@/lib/reorderCalculations';
import { SummaryCard } from '@/components/SummaryCard';
import { ProductsTable } from '@/components/ProductsTable';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [products, setProducts] = useState<ProductWithReorder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        const processedProducts = processProducts(data);
        setProducts(processedProducts);
        
        const summary = calculateSummary(processedProducts);
        if (summary.productsNeedingReorder > 0) {
          toast({
            title: "Reorder Alert",
            description: `${summary.productsNeedingReorder} products need immediate reordering.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  const summary = calculateSummary(products);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Inventory Reorder Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor stock levels and predict reordering needs
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <SummaryCard
            title="Total Products"
            value={summary.totalProducts}
            description="Items in inventory"
            icon={Package}
            trend="neutral"
          />
          <SummaryCard
            title="Needs Reorder"
            value={summary.productsNeedingReorder}
            description={`${Math.round((summary.productsNeedingReorder / summary.totalProducts) * 100)}% of inventory`}
            icon={AlertTriangle}
            trend="down"
          />
          <SummaryCard
            title="Critical Stock"
            value={summary.criticalStockCount}
            description="< 7 days until stockout"
            icon={TrendingDown}
            trend="down"
          />
          <SummaryCard
            title="Avg Lead Time"
            value={`${summary.averageLeadTime} days`}
            description="Average replenishment time"
            icon={Clock}
            trend="neutral"
          />
        </div>

        {/* Products Table */}
        <div className="bg-card rounded-lg shadow-sm">
          <div className="p-6 border-b border-border">
            <h2 className="text-2xl font-semibold text-card-foreground">
              Product Inventory
            </h2>
            <p className="text-muted-foreground mt-1">
              Click column headers to sort. Products highlighted need immediate reordering.
            </p>
          </div>
          <div className="p-6">
            <ProductsTable products={products} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
