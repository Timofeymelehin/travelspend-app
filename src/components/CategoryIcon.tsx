import React from 'react';
import {
  Plane,
  Train,
  Hotel,
  UtensilsCrossed,
  Landmark,
  ShoppingBag,
  Wifi,
  Coins,
  CreditCard,
  Banknote,
  Home,
  HeartPulse,
} from 'lucide-react';
import { CATEGORIES } from '../data/categories';

interface CategoryIconProps {
  categoryId: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryId,
  className = 'w-4 h-4',
  size,
}) => {
  const cat = CATEGORIES[categoryId] || CATEGORIES['misc'];

  const iconProps = { className, size };

  switch (cat.icon) {
    case 'Plane':
      return <Plane {...iconProps} />;
    case 'Train':
      return <Train {...iconProps} />;
    case 'Hotel':
      return <Hotel {...iconProps} />;
    case 'Home':
      return <Home {...iconProps} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed {...iconProps} />;
    case 'HeartPulse':
      return <HeartPulse {...iconProps} />;
    case 'Landmark':
      return <Landmark {...iconProps} />;
    case 'ShoppingBag':
      return <ShoppingBag {...iconProps} />;
    case 'Wifi':
      return <Wifi {...iconProps} />;
    default:
      return <Coins {...iconProps} />;
  }
};

export const PaymentMethodBadge: React.FC<{ method: string; className?: string }> = ({
  method,
  className = '',
}) => {
  switch (method) {
    case 'cash':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 ${className}`}>
          <Banknote className="w-3 h-3" />
          Наличные
        </span>
      );
    case 'card':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 ${className}`}>
          <CreditCard className="w-3 h-3" />
          Карта
        </span>
      );
    case 'transit_card':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 ${className}`}>
          <Train className="w-3 h-3" />
          Транспортная карта
        </span>
      );
    case 'prepaid':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30 ${className}`}>
          <CreditCard className="w-3 h-3" />
          Онлайн / Бронь
        </span>
      );
    default:
      return null;
  }
};
