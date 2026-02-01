import type { Product } from './product';

export type DealsFilterGroup = 'rating' | 'departments';

export type DealsActiveFilter = {
  group: DealsFilterGroup;
  key: string;
};

export type DealsFiltersState = {
  rating: {
    '4_up': boolean;
  };
  departments: Record<string, boolean>;
};

export type DealsPageProps = {
  products: Product[];
};

export type NavItem = {
  group: 'departments';
  key: string;
};
