
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard = ({ title, value, description, icon, className }: StatCardProps) => {
  return (
    <div className={cn("dashboard-card flex justify-between", className)}>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-3xl font-semibold mt-2">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {icon && (
        <div className="text-farm-blue">
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;
