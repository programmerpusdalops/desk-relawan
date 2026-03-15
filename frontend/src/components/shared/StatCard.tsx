import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: LucideIcon;
  variant?: 'default' | 'emergency';
  description?: string;
}

/**
 * StatCard - Kartu statistik untuk dashboard
 * Menampilkan metrik penting dengan ikon dan variant emergency
 */
export function StatCard({ title, value, icon: Icon, variant = 'default', description }: StatCardProps) {
  return (
    <div className={variant === 'emergency' ? 'stat-card-emergency' : 'stat-card'}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${variant === 'emergency' ? 'text-emergency' : 'text-foreground'}`}>
            {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {Icon && (
          <div className={`rounded-lg p-2 ${variant === 'emergency' ? 'bg-emergency/10' : 'bg-primary/10'}`}>
            <Icon className={`h-5 w-5 ${variant === 'emergency' ? 'text-emergency' : 'text-primary'}`} />
          </div>
        )}
      </div>
    </div>
  );
}
