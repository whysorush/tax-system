
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { taxApi, TaxDataType } from "@/services/taxApi";
import { toast } from "@/hooks/use-toast";

interface DataProcessingProps {
  onComplete: () => void;
}

const DataProcessing: React.FC<DataProcessingProps> = ({ onComplete }) => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [processed, setProcessed] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [taxData, setTaxData] = useState<TaxDataType | null>(null);

  useEffect(() => {
    // Get current tax data when component mounts
    const currentData = taxApi.getCurrentTaxData();
    if (currentData.spvId) {
      setTaxData(currentData);
    }
  }, []);

  // Simulated processing steps
  const processingSteps = [
    { id: 1, name: "Validate Entity Information", status: "pending", time: 2 },
    { id: 2, name: "Process Investor Data", status: "pending", time: 3 },
    { id: 3, name: "Calculate Distributions", status: "pending", time: 2 },
    { id: 4, name: "Prepare Tax Allocations", status: "pending", time: 4 },
    { id: 5, name: "Apply Tax Rules & Regulations", status: "pending", time: 3 }
  ];

  const [steps, setSteps] = useState(processingSteps);

  const startProcessing = async () => {
    if (!taxData) {
      toast({
        title: "No Data",
        description: "No tax data available to process.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setProgress(0);
    
    // Reset steps
    setSteps(processingSteps.map(step => ({ ...step, status: "pending" })));
    
    // Simulate processing steps with delays
    let cumulativeTime = 0;
    const totalTime = processingSteps.reduce((acc, step) => acc + step.time, 0);
    
    for (let i = 0; i < processingSteps.length; i++) {
      const step = processingSteps[i];
      
      // Update step status to processing
      setSteps(current => 
        current.map(s => 
          s.id === step.id ? { ...s, status: "processing" } : s
        )
      );
      
      // Wait for the step's processing time
      await new Promise(resolve => setTimeout(resolve, step.time * 500));
      
      // Update step status to completed
      setSteps(current => 
        current.map(s => 
          s.id === step.id ? { ...s, status: "completed" } : s
        )
      );
      
      // Update progress bar
      cumulativeTime += step.time;
      setProgress(Math.floor((cumulativeTime / totalTime) * 100));
    }
    
    try {
      // Call the API to process the data
      const processedData = await taxApi.processTaxData(taxData);
      setTaxData(processedData);
      setProcessed(true);
      
      toast({
        title: "Processing Complete",
        description: "Tax data has been successfully processed.",
      });
    } catch (error) {
      console.error("Error processing tax data:", error);
      toast({
        title: "Processing Error",
        description: "An error occurred while processing the tax data.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
      setProgress(100);
    }
  };

  const handleComplete = () => {
    if (!processed) {
      toast({
        title: "Processing Required",
        description: "Please process the tax data before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    onComplete();
    toast({
      title: "Step Completed",
      description: "Data processing step completed successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Processing</CardTitle>
          <CardDescription>Process tax data for {taxData?.entityName || "Selected SPV"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {taxData ? (
            <>
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Processing Progress</h3>
                <Progress value={progress} className="h-2" />
                {progress === 100 && (
                  <p className="text-xs text-right text-green-600 mt-1">Processing complete</p>
                )}
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Processing Step</TableHead>
                    <TableHead className="w-[100px] text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {steps.map((step) => (
                    <TableRow key={step.id}>
                      <TableCell>{step.name}</TableCell>
                      <TableCell className="text-right">
                        {step.status === "completed" ? (
                          <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                        ) : step.status === "processing" ? (
                          <Loader2 className="ml-auto h-5 w-5 animate-spin text-blue-500" />
                        ) : (
                          <Clock className="ml-auto h-5 w-5 text-gray-400" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex justify-between mt-6">
                <Button 
                  onClick={startProcessing} 
                  disabled={processing || processed}
                >
                  {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {processed ? "Processing Complete" : "Start Processing"}
                </Button>
                
                <Button 
                  onClick={handleComplete} 
                  disabled={!processed}
                  variant="default"
                >
                  Complete This Step
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No tax data available. Please complete the Data Collection step first.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataProcessing;
