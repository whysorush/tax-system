"use strict";
import prisma from '../db/prisma/client.js';

const investorService = {
    getInvestorsBySPV: async (spvId) => {
        try {
            const investors = await prisma.investor.findMany({
                where: { spvId: spvId },
                orderBy: { name: 'asc' }
            });
            return { data: investors, status: 'success' };
        } catch (error) {
            console.error('Error fetching investors:', error);
            return { error: 'Failed to fetch investors', status: 'error' };
        }
    },

    getInvestorById: async (id) => {
        try {
            return await prisma.investor.findUniqueOrThrow({
                where: { id: id }
            });
        } catch (error) {
            console.error('Error fetching investor:', error);
            throw error;
        }
    },

    createInvestor: async (investor) => {
        try {
            return await prisma.investor.create({
                data: investor
            });
        } catch (error) {
            console.error('Error creating investor:', error);
            throw error;
        }
    },

    updateInvestor: async (id, updates) => {
        try {
            return await prisma.investor.update({
                where: { id: id },
                data: updates
            });
        } catch (error) {
            console.error('Error updating investor:', error);
            throw error;
        }
    },

    deleteInvestor: async (id) => {
        try {
            await prisma.investor.delete({
                where: { id: id }
            });
        } catch (error) {
            console.error('Error deleting investor:', error);
            throw error;
        }
    }
};

export default investorService;
