import { Post } from '@/shared/types';
import { SearchFilters, FavoriteItem, CompareItem, Auction, Bid, Contract } from '@/shared/types/search';
import { ApiService } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class SearchService {
  // Search posts with filters
  static async searchPosts(filters: SearchFilters): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/posts/search`, {
      method: 'POST',
      headers: ApiService.getAuthHeaders(),
      body: JSON.stringify(filters),
    });
    
    if (!response.ok) {
      throw new Error('Failed to search posts');
    }
    
    return response.json();
  }

  // Favorite management
  static async addToFavorites(postId: number): Promise<FavoriteItem> {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: ApiService.getAuthHeaders(),
      body: JSON.stringify({ postId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add to favorites');
    }

    return response.json();
  }

  static async removeFromFavorites(postId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/favorites/${postId}`, {
      method: 'DELETE',
      headers: ApiService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to remove from favorites');
    }
  }

  static async getFavorites(): Promise<FavoriteItem[]> {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      headers: ApiService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get favorites');
    }

    return response.json();
  }

  // Compare functionality
  static async addToCompare(postId: number): Promise<CompareItem> {
    const response = await fetch(`${API_BASE_URL}/compare`, {
      method: 'POST',
      headers: ApiService.getAuthHeaders(),
      body: JSON.stringify({ postId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add to compare');
    }

    return response.json();
  }

  static async removeFromCompare(postId: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/compare/${postId}`, {
      method: 'DELETE',
      headers: ApiService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to remove from compare');
    }
  }

  static async getCompareList(): Promise<CompareItem[]> {
    const response = await fetch(`${API_BASE_URL}/compare`, {
      headers: ApiService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get compare list');
    }

    return response.json();
  }

  // Auction functionality
  static async placeBid(auctionId: number, amount: number): Promise<Bid> {
    const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}/bids`, {
      method: 'POST',
      headers: ApiService.getAuthHeaders(),
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error('Failed to place bid');
    }

    return response.json();
  }

  static async getAuction(postId: number): Promise<Auction> {
    const response = await fetch(`${API_BASE_URL}/auctions/post/${postId}`, {
      headers: ApiService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get auction details');
    }

    return response.json();
  }

  // Contract management
  static async createContract(postId: number): Promise<Contract> {
    const response = await fetch(`${API_BASE_URL}/contracts`, {
      method: 'POST',
      headers: ApiService.getAuthHeaders(),
      body: JSON.stringify({ postId }),
    });

    if (!response.ok) {
      throw new Error('Failed to create contract');
    }

    return response.json();
  }

  static async signContract(contractId: number): Promise<Contract> {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}/sign`, {
      method: 'POST',
      headers: ApiService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to sign contract');
    }

    return response.json();
  }

  static async getContract(contractId: number): Promise<Contract> {
    const response = await fetch(`${API_BASE_URL}/contracts/${contractId}`, {
      headers: ApiService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get contract');
    }

    return response.json();
  }
}