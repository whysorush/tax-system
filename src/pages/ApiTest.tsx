
import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';
import { SPVData } from '../types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ApiTest = () => {
  const [spvs, setSpvs] = useState<SPVData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New SPV form state
  const [newSpvName, setNewSpvName] = useState('');
  const [newSpvTaxId, setNewSpvTaxId] = useState('');
  const [newSpvTaxYear, setNewSpvTaxYear] = useState(2024);

  useEffect(() => {
    fetchSPVs();
  }, []);

  const fetchSPVs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getAllSPVs();
      if (response.status === 'success' && response.data) {
        setSpvs(response.data);
      } else {
        setError(response.error || 'Failed to fetch SPVs');
      }
    } catch (err) {
      setError('An error occurred while fetching SPVs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSPV = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiClient.createSPV({
        name: newSpvName,
        entityTaxId: newSpvTaxId,
        taxYear: Number(newSpvTaxYear)
      });
      
      if (response.status === 'success' && response.data) {
        setSpvs([response.data, ...spvs]);
        // Reset form
        setNewSpvName('');
        setNewSpvTaxId('');
        setNewSpvTaxYear(2024);
      } else {
        setError(response.error || 'Failed to create SPV');
      }
    } catch (err) {
      setError('An error occurred while creating SPV');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API Test Dashboard</h1>
      
      {/* Create SPV Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New SPV</CardTitle>
          <CardDescription>Add a new SPV to the database</CardDescription>
        </CardHeader>
        <form onSubmit={handleCreateSPV}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">SPV Name</Label>
              <Input 
                id="name" 
                value={newSpvName} 
                onChange={(e) => setNewSpvName(e.target.value)} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="taxId">Entity Tax ID</Label>
              <Input 
                id="taxId" 
                value={newSpvTaxId} 
                onChange={(e) => setNewSpvTaxId(e.target.value)} 
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="taxYear">Tax Year</Label>
              <Input 
                id="taxYear" 
                type="number" 
                value={newSpvTaxYear} 
                onChange={(e) => setNewSpvTaxYear(Number(e.target.value))} 
                required 
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create SPV'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {/* SPV List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">SPV List</h2>
          <Button onClick={fetchSPVs} disabled={loading} variant="outline">
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {spvs.map((spv) => (
            <Card key={spv.id}>
              <CardHeader>
                <CardTitle>{spv.name}</CardTitle>
                <CardDescription>Tax Year: {spv.taxYear}</CardDescription>
              </CardHeader>
              <CardContent>
                <p><strong>Entity Tax ID:</strong> {spv.entityTaxId}</p>
                <p><strong>Created:</strong> {new Date(spv.createdAt).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
          
          {spvs.length === 0 && !loading && (
            <div className="col-span-full text-center py-8 text-gray-500">
              No SPVs found. Create one to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
