export interface TechSpec {
  key: string;
  value: string;
}

export interface Post {
  id: number;
  title: string;
  type: 'xe' | 'pin';
  price: number;
  location: string;
  description: string;
  specs: TechSpec[];
  images?: string[];
  status?: 'pending' | 'published' | 'spam' | 'deleted';
  verified?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PostFormData {
  title: string;
  type: 'xe' | 'pin';
  price: string;
  location: string;
  description: string;
  specs: TechSpec[];
  images: File[];
}

