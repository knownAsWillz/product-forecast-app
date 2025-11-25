import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductWithReorder } from '@/lib/reorderCalculations';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SortField = keyof ProductWithReorder;
type SortDirection = 'asc' | 'desc';

interface ProductsTableProps {
  products: ProductWithReorder[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  const [sortField, setSortField] = useState<SortField>('product_name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
        return sortDirection === 'asc' 
          ? (aVal === bVal ? 0 : aVal ? -1 : 1)
          : (aVal === bVal ? 0 : aVal ? 1 : -1);
      }
      
      return 0;
    });
  }, [products, sortField, sortDirection]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="rounded-md border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('product_name')}
                className="h-8 px-2 lg:px-3"
              >
                Product Name
                <SortIcon field="product_name" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('current_inventory')}
                className="h-8 px-2 lg:px-3"
              >
                Current Stock
                <SortIcon field="current_inventory" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('average_sales_per_week')}
                className="h-8 px-2 lg:px-3"
              >
                Avg Sales/Week
                <SortIcon field="average_sales_per_week" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('replenish_lead_time_days')}
                className="h-8 px-2 lg:px-3"
              >
                Lead Time (Days)
                <SortIcon field="replenish_lead_time_days" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('daysUntilStockout')}
                className="h-8 px-2 lg:px-3"
              >
                Days Until Stockout
                <SortIcon field="daysUntilStockout" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('needsReorder')}
                className="h-8 px-2 lg:px-3"
              >
                Status
                <SortIcon field="needsReorder" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow 
              key={product.id}
              className={product.needsReorder ? 'bg-warning/5' : ''}
            >
              <TableCell className="font-medium">{product.product_name}</TableCell>
              <TableCell>
                <span className={product.needsReorder ? 'text-warning font-semibold' : ''}>
                  {product.current_inventory}
                </span>
              </TableCell>
              <TableCell>{product.average_sales_per_week}</TableCell>
              <TableCell>{product.replenish_lead_time_days}</TableCell>
              <TableCell>
                <span className={
                  product.daysUntilStockout === Infinity 
                    ? 'text-muted-foreground' 
                    : product.daysUntilStockout < 7 
                    ? 'text-destructive font-semibold'
                    : product.daysUntilStockout < 14
                    ? 'text-warning font-semibold'
                    : ''
                }>
                  {product.daysUntilStockout === Infinity ? '∞' : product.daysUntilStockout}
                </span>
              </TableCell>
              <TableCell>
                {product.needsReorder ? (
                  <Badge variant="destructive" className="bg-warning text-warning-foreground">
                    Reorder Now
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    In Stock
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
