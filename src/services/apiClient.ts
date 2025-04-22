
import { SPVData, InvestorData, TaxFormData, ApiResponse } from '../types/api';

const API_URL = 'http://localhost:3001/api';

export const apiClient = {
  // SPV API calls
  getAllSPVs: async (): Promise<ApiResponse<SPVData[]>> => {
    try {
      const response = await fetch(`${API_URL}/spvs`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching SPVs:', error);
      return { error: 'Failed to fetch SPVs', status: 'error' };
    }
  },

  getSPVById: async (id: string): Promise<ApiResponse<SPVData>> => {
    try {
      const response = await fetch(`${API_URL}/spvs/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching SPV:', error);
      return { error: 'Failed to fetch SPV', status: 'error' };
    }
  },

  createSPV: async (spv: { name: string; entityTaxId: string; taxYear: number }): Promise<ApiResponse<SPVData>> => {
    try {
      const response = await fetch(`${API_URL}/spvs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spv)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating SPV:', error);
      return { error: 'Failed to create SPV', status: 'error' };
    }
  },

  // Investor API calls
  getInvestorsBySPV: async (spvId: string): Promise<ApiResponse<InvestorData[]>> => {
    try {
      const response = await fetch(`${API_URL}/investors/spv/${spvId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching investors:', error);
      return { error: 'Failed to fetch investors', status: 'error' };
    }
  },

  // Tax Form API calls
  getTaxFormsBySPV: async (spvId: string): Promise<ApiResponse<TaxFormData[]>> => {
    try {
      const response = await fetch(`${API_URL}/tax-forms/spv/${spvId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching tax forms:', error);
      return { error: 'Failed to fetch tax forms', status: 'error' };
    }
  },

  createTaxForm: async (
    taxForm: { formType: string; spvId?: string; investorId?: string }
  ): Promise<ApiResponse<TaxFormData>> => {
    try {
      const response = await fetch(`${API_URL}/tax-forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taxForm)
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating tax form:', error);
      return { error: 'Failed to create tax form', status: 'error' };
    }
  }
};
