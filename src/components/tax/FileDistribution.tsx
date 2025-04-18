
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { taxApi, TaxDataType, InvestorData } from "@/services/taxApi";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface FileDistributionProps {
  onComplete: () => void;
}

const FileDistribution: React.FC<FileDistributionProps> = ({ onComplete }) => {
  const [distributing, setDistributing] = useState<boolean>(false);
  const [distributed, setDistributed] = useState<boolean>(false);
  const [taxData, setTaxData] = useState<TaxDataType | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [distributionStatus, setDistributionStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get current tax data when component mounts
    const currentData = taxApi.getCurrentTaxData();
    if (currentData.spvId) {
      setTaxData(currentData);
      // Check if files are already distributed
      const allDistributed = currentData.taxForms.every(form => 
        form.status === 'distributed' || form.status === 'approved' || form.status === 'submitted'
      );
      setDistributed(allDistributed);
      
      // Initialize distribution status
      if (currentData.investors.length > 0) {
        const status: Record<string, string> = {};
        currentData.investors.forEach(investor => {
          status[investor.id] = investor.k1Status === 'distributed' || 
                               investor.k1Status === 'approved' ? 'sent' : 'pending';
        });
        setDistributionStatus(status);
      }
    }
  }, []);

  const distributeFiles = async () => {
    if (!taxData) {
      toast({
        title: "No Data",
        description: "No tax data available to distribute.",
        variant: "destructive",
      });
      return;
    }

    setDistributing(true);
    setProgress(0);
    
    // Reset distribution status
    const initialStatus: Record<string, string> = {};
    taxData.investors.forEach(investor => {
      initialStatus[investor.id] = 'pending';
    });
    setDistributionStatus(initialStatus);
    
    // Simulate distribution to each investor
    for (let i = 0; i < taxData.investors.length; i++) {
      const investor = taxData.investors[i];
      
      // Update status to sending
      setDistributionStatus(current => ({
        ...current,
        [investor.id]: 'sending'
      }));
      
      // Wait to simulate sending
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update to sent
      setDistributionStatus(current => ({
        ...current,
        [investor.id]: 'sent'
      }));
      
      // Update progress
      setProgress(Math.floor(((i + 1) / taxData.investors.length) * 100));
    }
    
    try {
      // Call the API to mark files as distributed
      const updatedData = await taxApi.distributeTaxFiles(taxData);
      setTaxData(updatedData);
      setDistributed(true);
      
      toast({
        title: "Distribution Complete",
        description: "Tax files have been successfully distributed to all investors.",
      });
    } catch (error) {
      console.error("Error distributing tax files:", error);
      toast({
        title: "Distribution Error",
        description: "An error occurred while distributing the tax files.",
        variant: "destructive",
      });
    } finally {
      setDistributing(false);
      setProgress(100);
    }
  };

  const handleComplete = () => {
    if (!distributed) {
      toast({
        title: "Distribution Required",
        description: "Please distribute the tax files before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    onComplete();
    toast({
      title: "Step Completed",
      description: "File distribution step completed successfully.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'sending':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Mail className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>File Distribution</CardTitle>
          <CardDescription>Distribute tax forms for {taxData?.entityName || "Selected SPV"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {taxData ? (
            <>
              <div className="mb-6">
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertTitle>K-1 Distribution</AlertTitle>
                  <AlertDescription>
                    We'll securely distribute K-1s to all {taxData.investors.length} investors via email. 
                    Entity tax forms will be available to authorized representatives.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Distribution Progress</h3>
                <Progress value={progress} className="h-2" />
                {progress === 100 && (
                  <p className="text-xs text-right text-green-600 mt-1">Distribution complete</p>
                )}
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Investor</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-[100px] text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxData.investors.map((investor) => (
                    <TableRow key={investor.id}>
                      <TableCell className="font-medium">{investor.name}</TableCell>
                      <TableCell>{investor.email}</TableCell>
                      <TableCell className="text-right">
                        {getStatusIcon(distributionStatus[investor.id] || 'pending')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex justify-between mt-6">
                <Button 
                  onClick={distributeFiles} 
                  disabled={distributing || distributed}
                >
                  {distributing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {distributed ? "Files Distributed" : "Distribute Tax Files"}
                </Button>
                
                <Button 
                  onClick={handleComplete} 
                  disabled={!distributed}
                  variant="default"
                >
                  Complete This Step
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No tax data available. Please complete the previous steps first.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileDistribution;
