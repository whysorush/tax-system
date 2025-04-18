
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileCheck, AlertTriangle, Check } from "lucide-react";
import { taxApi, TaxDataType, TaxFormType } from "@/services/taxApi";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ApprovalProps {
  onComplete: () => void;
}

const Approval: React.FC<ApprovalProps> = ({ onComplete }) => {
  const [approving, setApproving] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [taxData, setTaxData] = useState<TaxDataType | null>(null);
  const [confirmationChecks, setConfirmationChecks] = useState({
    reviewedForms: false,
    allInfoCorrect: false,
    authorizeSubmission: false
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // Get current tax data when component mounts
    const currentData = taxApi.getCurrentTaxData();
    if (currentData.spvId) {
      setTaxData(currentData);
      // Check if files are already approved
      const allApproved = currentData.taxForms.every(form => 
        form.status === 'approved' || form.status === 'submitted'
      );
      setApproved(allApproved);
    }
  }, []);

  const allChecksConfirmed = Object.values(confirmationChecks).every(check => check);

  const approveTaxFiling = async () => {
    setDialogOpen(false);
    
    if (!taxData) {
      toast({
        title: "No Data",
        description: "No tax data available to approve.",
        variant: "destructive",
      });
      return;
    }

    if (!allChecksConfirmed) {
      toast({
        title: "Confirmation Required",
        description: "You must confirm all items before approving.",
        variant: "destructive",
      });
      return;
    }

    setApproving(true);
    
    try {
      // Call the API to approve the tax filing
      const updatedData = await taxApi.approveTaxFiling(taxData);
      setTaxData(updatedData);
      setApproved(true);
      
      toast({
        title: "Approval Complete",
        description: "Tax filing has been successfully approved.",
      });
    } catch (error) {
      console.error("Error approving tax filing:", error);
      toast({
        title: "Approval Error",
        description: "An error occurred while approving the tax filing.",
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  const handleComplete = () => {
    if (!approved) {
      toast({
        title: "Approval Required",
        description: "Please approve the tax filing before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    onComplete();
    toast({
      title: "Step Completed",
      description: "Approval step completed successfully.",
    });
  };

  const formatFormType = (formType: string) => {
    if (formType === '1065') return 'Form 1065 (Partnership Return)';
    if (formType === 'K-1') return 'Schedule K-1 (Partner\'s Share)';
    return formType;
  };

  const handleCheckChange = (checkName: keyof typeof confirmationChecks) => {
    setConfirmationChecks(prev => ({
      ...prev,
      [checkName]: !prev[checkName]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tax Filing Approval</CardTitle>
          <CardDescription>Review and approve tax forms for {taxData?.entityName || "Selected SPV"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {taxData ? (
            <>
              <Alert>
                <FileCheck className="h-4 w-4" />
                <AlertTitle>Final Review</AlertTitle>
                <AlertDescription>
                  This is the final review before electronic filing. Carefully review all tax forms and approve for submission.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4 mt-6">
                {taxData.taxForms.map((form, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{formatFormType(form.formType)}</h3>
                        <p className="text-sm text-muted-foreground">
                          Status: {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                        </p>
                      </div>
                      {form.downloadUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={form.downloadUrl} target="_blank" rel="noopener noreferrer">
                            Review Form
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Alert variant="destructive" className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Notice</AlertTitle>
                <AlertDescription>
                  By approving these tax forms, you are confirming that all information is accurate and complete 
                  to the best of your knowledge. This approval authorizes the electronic filing of these forms.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-between mt-6">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      disabled={approving || approved}
                    >
                      {approving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {approved ? (
                        <><Check className="mr-2 h-4 w-4" /> Approved</> 
                      ) : (
                        "Approve Tax Filing"
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Tax Filing Approval</DialogTitle>
                      <DialogDescription>
                        Please confirm the following before approving the tax filing for {taxData.entityName}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="reviewedForms" 
                          checked={confirmationChecks.reviewedForms}
                          onCheckedChange={() => handleCheckChange('reviewedForms')}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="reviewedForms">
                            I have reviewed all tax forms and K-1s
                          </Label>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="allInfoCorrect" 
                          checked={confirmationChecks.allInfoCorrect}
                          onCheckedChange={() => handleCheckChange('allInfoCorrect')}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="allInfoCorrect">
                            I confirm all information is accurate and complete
                          </Label>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="authorizeSubmission" 
                          checked={confirmationChecks.authorizeSubmission}
                          onCheckedChange={() => handleCheckChange('authorizeSubmission')}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="authorizeSubmission">
                            I authorize the electronic filing of these tax forms
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button 
                        onClick={approveTaxFiling}
                        disabled={!allChecksConfirmed}
                      >
                        Approve and Continue
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  onClick={handleComplete} 
                  disabled={!approved}
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

export default Approval;
