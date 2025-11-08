import { ApiService } from '@/lib/api';
import { Contract, CreateContractRequest, SignContractRequest } from '@/shared/types/contract';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export class ContractService {
  static async createContract(data: CreateContractRequest): Promise<Contract> {
    try {
      const response = await fetch(`${API_ENDPOINT}/contracts`, {
        method: 'POST',
        headers: {
          ...ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create contract');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  }

  static async getContract(contractId: string): Promise<Contract> {
    try {
      const response = await fetch(`${API_ENDPOINT}/contracts/${contractId}`, {
        headers: {
          ...ApiService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contract');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching contract:', error);
      throw error;
    }
  }

  static async signContract(data: SignContractRequest): Promise<Contract> {
    try {
      const response = await fetch(`${API_ENDPOINT}/contracts/${data.contractId}/sign`, {
        method: 'POST',
        headers: {
          ...ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signature: data.signature,
          party: data.party,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign contract');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error signing contract:', error);
      throw error;
    }
  }

  // Fetch contract preview by orderId
  static async getContractByOrder(orderId: string): Promise<Contract> {
    try {
      const response = await fetch(`${API_ENDPOINT}/contract/${encodeURIComponent(orderId)}`, {
        headers: {
          ...ApiService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contract by order');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching contract by order:', error);
      throw error;
    }
  }

  // Accept contract (click-to-accept) for order
  static async acceptContract(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${API_ENDPOINT}/orders/${encodeURIComponent(orderId)}/contracts/accept`, {
        method: 'POST',
        headers: {
          ...ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to accept contract');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error accepting contract:', error);
      throw error;
    }
  }

  // Cancel contract for order
  static async cancelContract(orderId: string): Promise<any> {
    try {
      const response = await fetch(`${API_ENDPOINT}/orders/${encodeURIComponent(orderId)}/contracts/cancel`, {
        method: 'POST',
        headers: {
          ...ApiService.getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to cancel contract');
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error cancelling contract:', error);
      throw error;
    }
  }
}