
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}

export interface SPVData {
  id: string;
  name: string;
  entityTaxId: string;
  taxYear: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestorData {
  id: string;
  name: string;
  email: string;
  taxId: string;
  spvId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxFormData {
  id: string;
  formType: string;
  status: string;
  downloadUrl?: string;
  spvId?: string;
  investorId?: string;
  createdAt: Date;
  updatedAt: Date;
}
