
// Mock implementation of the Allocations API service
// Replace with actual API calls in production

export interface TaxDataType {
  spvId: string;
  taxYear: string;
  entityName: string;
  entityTaxId: string;
  investors: InvestorData[];
  taxForms: TaxFormType[];
}

export interface InvestorData {
  id: string;
  name: string;
  taxId: string;
  email: string;
  k1Status?: 'pending' | 'generated' | 'distributed' | 'approved';
}

export interface TaxFormType {
  id: string;
  formType: string;
  status: 'pending' | 'generated' | 'distributed' | 'approved' | 'submitted';
  downloadUrl?: string;
}

// Mock data for testing
const mockSPVs = [
  { id: 'spv-001', name: 'Tech Ventures Fund I' },
  { id: 'spv-002', name: 'Healthcare Innovations SPV' },
  { id: 'spv-003', name: 'Real Estate Opportunity Fund' }
];

// Sample tax data
let currentTaxData: TaxDataType = {
  spvId: '',
  taxYear: '',
  entityName: '',
  entityTaxId: '',
  investors: [],
  taxForms: []
};

export const taxApi = {
  // Data Collection
  fetchSPVs: async () => {
    // Simulate API call
    return new Promise<{ id: string, name: string }[]>(resolve => {
      setTimeout(() => resolve(mockSPVs), 800);
    });
  },
  
  fetchSPVDetails: async (spvId: string) => {
    // Simulate API call
    return new Promise<TaxDataType>(resolve => {
      const mockTaxData: TaxDataType = {
        spvId,
        taxYear: new Date().getFullYear().toString(),
        entityName: mockSPVs.find(spv => spv.id === spvId)?.name || '',
        entityTaxId: `XX-${Math.floor(1000000 + Math.random() * 9000000)}`,
        investors: Array(5).fill(null).map((_, i) => ({
          id: `inv-${i + 100}`,
          name: `Investor ${i + 1}`,
          taxId: `XXX-XX-${Math.floor(1000 + Math.random() * 9000)}`,
          email: `investor${i + 1}@example.com`,
          k1Status: 'pending'
        })),
        taxForms: [
          { id: 'form-1', formType: '1065', status: 'pending' },
          { id: 'form-2', formType: 'K-1', status: 'pending' }
        ]
      };
      
      currentTaxData = mockTaxData;
      setTimeout(() => resolve(mockTaxData), 1000);
    });
  },
  
  // Data Processing
  processTaxData: async (data: TaxDataType) => {
    // Simulate processing
    return new Promise<TaxDataType>(resolve => {
      const processedData = {
        ...data,
        taxForms: data.taxForms.map(form => ({
          ...form,
          status: 'generated' as const
        })),
        investors: data.investors.map(investor => ({
          ...investor,
          k1Status: 'generated' as const
        }))
      };
      
      currentTaxData = processedData;
      setTimeout(() => resolve(processedData), 1500);
    });
  },
  
  // File Generation
  generateTaxFiles: async (data: TaxDataType) => {
    // Simulate file generation
    return new Promise<TaxDataType>(resolve => {
      const updatedData = {
        ...data,
        taxForms: data.taxForms.map(form => ({
          ...form,
          status: 'generated' as const,
          downloadUrl: `https://example.com/tax/${data.spvId}/${form.formType}.pdf`
        }))
      };
      
      currentTaxData = updatedData;
      setTimeout(() => resolve(updatedData), 2000);
    });
  },
  
  // File Distribution
  distributeTaxFiles: async (data: TaxDataType) => {
    // Simulate distribution
    return new Promise<TaxDataType>(resolve => {
      const distributedData = {
        ...data,
        taxForms: data.taxForms.map(form => ({
          ...form,
          status: 'distributed' as const
        })),
        investors: data.investors.map(investor => ({
          ...investor,
          k1Status: 'distributed' as const
        }))
      };
      
      currentTaxData = distributedData;
      setTimeout(() => resolve(distributedData), 1800);
    });
  },
  
  // Approval
  approveTaxFiling: async (data: TaxDataType) => {
    // Simulate approval
    return new Promise<TaxDataType>(resolve => {
      const approvedData = {
        ...data,
        taxForms: data.taxForms.map(form => ({
          ...form,
          status: 'approved' as const
        })),
        investors: data.investors.map(investor => ({
          ...investor,
          k1Status: 'approved' as const
        }))
      };
      
      currentTaxData = approvedData;
      setTimeout(() => resolve(approvedData), 1200);
    });
  },
  
  // E-File Submission
  submitEFile: async (data: TaxDataType) => {
    // Simulate e-filing
    return new Promise<{ success: boolean, confirmationId: string }>(resolve => {
      const updatedData = {
        ...data,
        taxForms: data.taxForms.map(form => ({
          ...form,
          status: 'submitted' as const
        }))
      };
      
      currentTaxData = updatedData;
      setTimeout(() => 
        resolve({ 
          success: true, 
          confirmationId: `EFILE-${Math.floor(100000 + Math.random() * 900000)}` 
        }), 
      2500);
    });
  },
  
  // Get current state
  getCurrentTaxData: () => {
    return currentTaxData;
  }
};
