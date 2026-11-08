import type { AddressData } from './address';

export type OrderSummary = {
  id: number;
  createdAt: string;
  totalAmount: string;
  status: string;
};

export type OrderItem = {
  id: number;
  quantity: number;
  price: string;
  product: {
    id: number;
    title: string;
    description: string;
    image: string;
  };
};

export type OrderDetails = OrderSummary & {
  paymentMethod: string;
  address: AddressData;
  orderItems: OrderItem[];
};
