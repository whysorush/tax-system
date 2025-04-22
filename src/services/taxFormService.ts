import { ApiResponse, TaxFormData } from '../types/api';
import prisma from '../db/prisma/client';

const taxFormService = {
  getTaxFormsBySPV: async (spvId: string): Promise<ApiResponse<TaxFormData[]>> => {
    try {
      const taxForms = await prisma.taxForm.findMany({
        where: { spvId },
        orderBy: { createdAt: 'desc' }
      });
      return { data: taxForms, status: 'success' };
    } catch (error) {
      console.error('Error fetching tax forms:', error);
      return { error: 'Failed to fetch tax forms', status: 'error' };
    }
  },

  getTaxFormsByInvestor: async (investorId: string): Promise<ApiResponse<TaxFormData[]>> => {
    try {
      const taxForms = await prisma.taxForm.findMany({
        where: { investorId },
        orderBy: { createdAt: 'desc' }
      });
      return { data: taxForms, status: 'success' };
    } catch (error) {
      console.error('Error fetching tax forms:', error);
      return { error: 'Failed to fetch tax forms', status: 'error' };
    }
  },

  createTaxForm: async (taxForm: { formType: string; spvId?: string; investorId?: string }): Promise<ApiResponse<TaxFormData>> => {
    try {
      const newTaxForm = await prisma.taxForm.create({
        data: taxForm
      });
      return { data: newTaxForm, status: 'success' };
    } catch (error) {
      console.error('Error creating tax form:', error);
      return { error: 'Failed to create tax form', status: 'error' };
    }
  },

  updateTaxFormStatus: async (id: string, status: string): Promise<ApiResponse<TaxFormData>> => {
    try {
      const updatedTaxForm = await prisma.taxForm.update({
        where: { id },
        data: { status }
      });
      return { data: updatedTaxForm, status: 'success' };
    } catch (error) {
      console.error('Error updating tax form:', error);
      return { error: 'Failed to update tax form', status: 'error' };
    }
  },

  updateTaxFormDownloadUrl: async (id: string, downloadUrl: string): Promise<ApiResponse<TaxFormData>> => {
    try {
      const updatedTaxForm = await prisma.taxForm.update({
        where: { id },
        data: { downloadUrl }
      });
      return { data: updatedTaxForm, status: 'success' };
    } catch (error) {
      console.error('Error updating tax form download URL:', error);
      return { error: 'Failed to update tax form download URL', status: 'error' };
    }
  }
};

export default taxFormService;
