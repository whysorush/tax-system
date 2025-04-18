
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { taxApi, TaxDataType } from "@/services/taxApi";
import { toast } from "@/hooks/use-toast";

interface DataCollectionProps {
  onComplete: () => void;
}

const DataCollection: React.FC<DataCollectionProps> = ({ onComplete }) => {
  const [spvs, setSpvs] = useState<{ id: string, name: string }[]>([]);
  const [selectedSpv, setSelectedSpv] = useState<string>("");
  const [taxYear, setTaxYear] = useState<string>(new Date().getFullYear().toString());
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingSpvs, setFetchingSpvs] = useState<boolean>(true);
  const [spvData, setSpvData] = useState<TaxDataType | null>(null);

  useEffect(() => {
    // Fetch SPVs when component mounts
    fetchSpvs();
  }, []);

  const fetchSpvs = async () => {
    setFetchingSpvs(true);
    try {
      const data = await taxApi.fetchSPVs();
      setSpvs(data);
    } catch (error) {
      console.error("Error fetching SPVs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch SPVs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setFetchingSpvs(false);
    }
  };

  const fetchSpvDetails = async () => {
    if (!selectedSpv) {
      toast({
        title: "Selection Required",
        description: "Please select an SPV first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await taxApi.fetchSPVDetails(selectedSpv);
      setSpvData(data);
      toast({
        title: "Data Loaded",
        description: `Successfully loaded tax data for ${data.entityName}.`,
      });
    } catch (error) {
      console.error("Error fetching SPV details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch SPV details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (!spvData) {
      toast({
        title: "Data Required",
        description: "Please fetch SPV data before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    onComplete();
    toast({
      title: "Step Completed",
      description: "Data collection step completed successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Collection</CardTitle>
          <CardDescription>Select an SPV and tax year to begin the tax filing process</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="spv-select">Select SPV</Label>
            <Select 
              value={selectedSpv} 
              onValueChange={setSelectedSpv} 
              disabled={fetchingSpvs}
            >
              <SelectTrigger id="spv-select">
                <SelectValue placeholder="Select an SPV" />
              </SelectTrigger>
              <SelectContent>
                {spvs.map((spv) => (
                  <SelectItem key={spv.id} value={spv.id}>
                    {spv.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tax-year">Tax Year</Label>
            <Input
              id="tax-year"
              type="number"
              value={taxYear}
              onChange={(e) => setTaxYear(e.target.value)}
              min="2000"
              max="2050"
            />
          </div>
          
          <Button 
            onClick={fetchSpvDetails} 
            disabled={!selectedSpv || loading}
            className="w-full mt-4"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Fetch SPV Tax Data
          </Button>
        </CardContent>
      </Card>
      
      {spvData && (
        <Card>
          <CardHeader>
            <CardTitle>SPV Tax Information</CardTitle>
            <CardDescription>Review the collected tax information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Entity Name</Label>
                <p className="text-sm">{spvData.entityName}</p>
              </div>
              <div className="space-y-1">
                <Label>Entity Tax ID</Label>
                <p className="text-sm">{spvData.entityTaxId}</p>
              </div>
              <div className="space-y-1">
                <Label>Number of Investors</Label>
                <p className="text-sm">{spvData.investors.length}</p>
              </div>
              <div className="space-y-1">
                <Label>Required Tax Forms</Label>
                <p className="text-sm">
                  {spvData.taxForms.map(form => form.formType).join(', ')}
                </p>
              </div>
            </div>
            
            <Button 
              onClick={handleComplete} 
              className="w-full mt-6"
            >
              Complete Data Collection
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataCollection;
