import { ApiResponse, SPVData } from '../types/api';
import prisma from '../db/prisma/client';

interface SPV {
  id: string;
  name: string;
  // ... other fields
}

const spvService = {
  getAllSPVs: async (): Promise<{ data: SPV[]; status: string }> => {
    try {
      const spvs = await prisma.spv.findMany();
      return { data: spvs, status: 'success' };
    } catch (error) {
      console.error('Error fetching SPVs:', error);
      return { data: [], status: 'error' };
    }
  },

  getSPVById: async (id: string) => {
    try {
      return await prisma.sPV.findUniqueOrThrow({
        where: { id }
      });
    } catch (error) {
      console.error('Error fetching SPV:', error);
      throw error;
    }
  },

  createSPV: async (spv: { name: string; entityTaxId: string; taxYear: number }) => {
    try {
      return await prisma.sPV.create({
        data: spv
      });
    } catch (error) {
      console.error('Error creating SPV:', error);
      throw error;
    }
  },

  updateSPV: async (id: string, updates: { name?: string; entityTaxId?: string; taxYear?: number }) => {
    try {
      return await prisma.sPV.update({
        where: { id },
        data: updates
      });
    } catch (error) {
      console.error('Error updating SPV:', error);
      throw error;
    }
  },

  deleteSPV: async (id: string) => {
    try {
      await prisma.sPV.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting SPV:', error);
      throw error;
    }
  }
};

export default spvService;
