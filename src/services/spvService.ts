
import prisma from './db/prisma/client';

export const spvService = {
  getAllSPVs: async () => {
    try {
      return await prisma.sPV.findMany({
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Error fetching SPVs:', error);
      throw error;
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
