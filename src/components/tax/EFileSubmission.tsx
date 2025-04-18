
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileUp, CheckCircle, ClipboardCopy } from "lucide-react";
import { taxApi, TaxDataType } from "@/services/taxApi";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface EFileSubmissionProps {
  onComplete: () => void;
}

const EFileSubmission: React.FC<EFileSubmissionProps> = ({ onComplete }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [taxData, setTaxData] = useState<TaxDataType | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [confirmationId, setConfirmationId] = useState<string>("");
  const [submissionStage, setSubmissionStage] = useState<string>("");

  useEffect(() => {
    // Get current tax data when component mounts
    const currentData = taxApi.getCurrentTaxData();
    if (currentData.spvId) {
      setTaxData(currentData);
      // Check if already submitted
      const allSubmitted = currentData.taxForms.every(form => form.status === 'submitted');
      setSubmitted(allSubmitted);
    }
  }, []);

  const submitEFile = async () => {
    if (!taxData) {
      toast({
        title: "No Data",
        description: "No tax data available to submit.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    setProgress(0);
    
    // Simulate stages of submission
    const stages = [
      "Preparing submission package",
      "Validating tax information",
      "Encrypting sensitive data",
      "Connecting to IRS e-file system",
      "Submitting forms",
      "Receiving confirmation"
    ];
    
    for (let i = 0; i < stages.length; i++) {
      setSubmissionStage(stages[i]);
      setProgress(Math.floor(((i + 1) / stages.length) * 100));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    try {
      // Call the API to submit the e-file
      const result = await taxApi.submitEFile(taxData);
      
      if (result.success) {
        setConfirmationId(result.confirmationId);
        setSubmitted(true);
        
        toast({
          title: "Submission Complete",
          description: `Tax forms successfully e-filed with confirmation ID: ${result.confirmationId}`,
        });
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting e-file:", error);
      toast({
        title: "Submission Error",
        description: "An error occurred while submitting the tax e-file.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = () => {
    if (!submitted) {
      toast({
        title: "Submission Required",
        description: "Please submit the tax e-file before completing.",
        variant: "destructive",
      });
      return;
    }
    
    onComplete();
    toast({
      title: "Process Completed",
      description: "The entire tax filing process has been successfully completed.",
    });
  };

  const copyConfirmationId = () => {
    navigator.clipboard.writeText(confirmationId);
    toast({
      title: "Copied",
      description: "Confirmation ID copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>E-File Submission</CardTitle>
          <CardDescription>Submit tax forms electronically for {taxData?.entityName || "Selected SPV"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {taxData ? (
            <>
              <Alert>
                <FileUp className="h-4 w-4" />
                <AlertTitle>Final Submission</AlertTitle>
                <AlertDescription>
                  This is the final step to electronically file all tax forms with the IRS.
                  Once submitted, you'll receive a confirmation ID for your records.
                </AlertDescription>
              </Alert>
              
              {!submitted && (
                <div className="my-6">
                  <h3 className="text-sm font-medium mb-2">
                    {submitting ? submissionStage : "Ready for submission"}
                  </h3>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              {submitted && confirmationId && (
                <Card className="mt-6">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <h3 className="text-lg font-medium">Submission Successful</h3>
                    </div>
                    
                    <p className="mt-2 text-muted-foreground">
                      All tax forms have been successfully e-filed with the IRS.
                    </p>
                    
                    <div className="mt-4 p-3 bg-muted rounded-md flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Confirmation ID</p>
                        <p className="text-lg font-mono">{confirmationId}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={copyConfirmationId}
                      >
                        <ClipboardCopy className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="mt-4 text-sm">
                      Please save this confirmation ID for your records. You'll need it if you 
                      need to reference this filing in the future.
                    </p>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-between mt-6">
                <Button 
                  onClick={submitEFile} 
                  disabled={submitting || submitted}
                >
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {submitted ? "Successfully Submitted" : "Submit E-File"}
                </Button>
                
                <Button 
                  onClick={handleComplete} 
                  disabled={!submitted}
                  variant="default"
                >
                  Complete Tax Process
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

export default EFileSubmission;
