export interface SearchFilters {
  brand?: string;
  model?: string;
  batteryCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
  batteryHealth?: number;
  mileage?: number;
  manufactureYear?: number;
  type: 'xe' | 'pin';
  sortBy?: 'price' | 'date' | 'relevance';
  sortOrder?: 'asc' | 'desc';
}

export interface FavoriteItem {
  id: number;
  postId: number;
  userId: number;
  createdAt: string;
}

export interface CompareItem {
  id: number;
  postId: number;
  userId: number;
  createdAt: string;
}

export interface Auction {
  id: number;
  postId: number;
  startPrice: number;
  currentPrice: number;
  minBidIncrement: number;
  startTime: string;
  endTime: string;
  status: 'active' | 'ended' | 'cancelled';
  bids: Bid[];
}

export interface Bid {
  id: number;
  auctionId: number;
  userId: number;
  amount: number;
  createdAt: string;
}

export interface Contract {
  id: number;
  postId: number;
  buyerId: number;
  sellerId: number;
  price: number;
  status: 'pending' | 'signed' | 'completed' | 'cancelled';
  signedBySeller: boolean;
  signedByBuyer: boolean;
  createdAt: string;
  completedAt?: string;
}