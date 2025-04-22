const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const api = {
  // SPV endpoints
  spvs: {
    getAll: () => fetch(`${API_BASE_URL}/spvs`).then(res => res.json()),
    getById: (id: string) => fetch(`${API_BASE_URL}/spvs/${id}`).then(res => res.json()),
    create: (data: any) => fetch(`${API_BASE_URL}/spvs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    update: (id: string, data: any) => fetch(`${API_BASE_URL}/spvs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()),
    delete: (id: string) => fetch(`${API_BASE_URL}/spvs/${id}`, {
      method: 'DELETE'
    }).then(res => res.json())
  },

  // Investor endpoints
  investors: {
    getBySPV: (spvId: string) => fetch(`${API_BASE_URL}/investors/spv/${spvId}`).then(res => res.json()),
    getById: (id: string) => fetch(`${API_BASE_URL}/investors/${id}`).then(res => res.json()),
    create: (data: any) => fetch(`${API_BASE_URL}/investors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  },

  // Tax Form endpoints
  taxForms: {
    getBySPV: (spvId: string) => fetch(`${API_BASE_URL}/tax-forms/spv/${spvId}`).then(res => res.json()),
    getByInvestor: (investorId: string) => fetch(`${API_BASE_URL}/tax-forms/investor/${investorId}`).then(res => res.json()),
    create: (data: any) => fetch(`${API_BASE_URL}/tax-forms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json())
  }
}; 