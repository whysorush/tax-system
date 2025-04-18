
import prisma from './db/prisma/client';

export const taxFormService = {
  getTaxFormsBySPV: async (spvId: string) => {
    try {
      return await prisma.taxForm.findMany({
        where: { spvId },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching tax forms:', error);
      throw error;
    }
  },

  getTaxFormsByInvestor: async (investorId: string) => {
    try {
      return await prisma.taxForm.findMany({
        where: { investorId },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching tax forms:', error);
      throw error;
    }
  },

  createTaxForm: async (taxForm: { formType: string; spvId?: string; investorId?: string }) => {
    try {
      return await prisma.taxForm.create({
        data: taxForm
      });
    } catch (error) {
      console.error('Error creating tax form:', error);
      throw error;
    }
  },

  updateTaxFormStatus: async (id: string, status: string) => {
    try {
      return await prisma.taxForm.update({
        where: { id },
        data: { status }
      });
    } catch (error) {
      console.error('Error updating tax form status:', error);
      throw error;
    }
  },

  updateTaxFormDownloadUrl: async (id: string, downloadUrl: string) => {
    try {
      return await prisma.taxForm.update({
        where: { id },
        data: { downloadUrl }
      });
    } catch (error) {
      console.error('Error updating tax form download URL:', error);
      throw error;
    }
  }
};
