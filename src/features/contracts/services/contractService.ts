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
}