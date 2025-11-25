import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
}

export function SummaryCard({ title, value, description, icon: Icon, trend = 'neutral' }: SummaryCardProps) {
  const trendColors = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className={`text-xs ${trendColors[trend]} mt-1`}>
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
