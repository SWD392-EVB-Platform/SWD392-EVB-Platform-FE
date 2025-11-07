export interface Contract {
  contractId: string;
  sellerId: string;
  buyerId: string;
  itemId: string;
  itemType: 'battery' | 'vehicle';
  status: 'draft' | 'pending' | 'signed' | 'completed' | 'cancelled';
  price: number;
  termsAndConditions: string;
  createdAt: string;
  updatedAt: string;
  signatures?: {
    seller?: {
      signature: string;
      signedAt: string;
    };
    buyer?: {
      signature: string;
      signedAt: string;
    };
  };
}

export interface CreateContractRequest {
  sellerId: string;
  buyerId: string;
  itemId: string;
  itemType: 'battery' | 'vehicle';
  price: number;
  termsAndConditions?: string;
}

export interface SignContractRequest {
  contractId: string;
  signature: string;
  party: 'seller' | 'buyer';
}