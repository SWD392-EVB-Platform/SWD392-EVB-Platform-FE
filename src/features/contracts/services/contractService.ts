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
  // Returns null if contract doesn't exist yet (will be created by IPN callback)
  static async getContractByOrder(orderId: string): Promise<Contract | null> {
    try {
      const response = await fetch(`${API_ENDPOINT}/contract/${encodeURIComponent(orderId)}`, {
        headers: {
          ...ApiService.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        // 404 means contract doesn't exist yet (normal case after payment)
        if (response.status === 404) {
          console.log(`Contract for order ${orderId} not found yet (will be created by IPN callback)`);
          return null;
        }
        // Other errors should be thrown
        const errorText = await response.text();
        throw new Error(`Failed to fetch contract: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      return result.data || null;
    } catch (error) {
      console.error('Error fetching contract by order:', error);
      // Return null instead of throwing - contract may not exist yet
      return null;
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