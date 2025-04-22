import { ApiResponse, InvestorData } from '../types/api';
import prisma from '../db/prisma/client';

const investorService = {
  getInvestorsBySPV: async (spvId: string): Promise<ApiResponse<InvestorData[]>> => {
    try {
      const investors = await prisma.investor.findMany({
        where: { spvId },
        orderBy: { name: 'asc' }
      });
      return { data: investors, status: 'success' };
    } catch (error) {
      console.error('Error fetching investors:', error);
      return { error: 'Failed to fetch investors', status: 'error' };
    }
  },

  getInvestorById: async (id: string) => {
    try {
      return await prisma.investor.findUniqueOrThrow({
        where: { id }
      });
    } catch (error) {
      console.error('Error fetching investor:', error);
      throw error;
    }
  },

  createInvestor: async (investor: { name: string; email: string; taxId: string; spvId?: string }) => {
    try {
      return await prisma.investor.create({
        data: investor
      });
    } catch (error) {
      console.error('Error creating investor:', error);
      throw error;
    }
  },

  updateInvestor: async (id: string, updates: { name?: string; email?: string; taxId?: string; spvId?: string }) => {
    try {
      return await prisma.investor.update({
        where: { id },
        data: updates
      });
    } catch (error) {
      console.error('Error updating investor:', error);
      throw error;
    }
  },

  deleteInvestor: async (id: string) => {
    try {
      await prisma.investor.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting investor:', error);
      throw error;
    }
  }
};

export default investorService;
