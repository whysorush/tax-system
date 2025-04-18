
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, FileText } from "lucide-react";
import { taxApi, TaxDataType, TaxFormType } from "@/services/taxApi";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FileGenerationProps {
  onComplete: () => void;
}

const FileGeneration: React.FC<FileGenerationProps> = ({ onComplete }) => {
  const [generating, setGenerating] = useState<boolean>(false);
  const [generated, setGenerated] = useState<boolean>(false);
  const [taxData, setTaxData] = useState<TaxDataType | null>(null);

  useEffect(() => {
    // Get current tax data when component mounts
    const currentData = taxApi.getCurrentTaxData();
    if (currentData.spvId) {
      setTaxData(currentData);
      // Check if files are already generated
      const allGenerated = currentData.taxForms.every(form => 
        form.status === 'generated' || form.status === 'distributed' || 
        form.status === 'approved' || form.status === 'submitted'
      );
      setGenerated(allGenerated);
    }
  }, []);

  const generateFiles = async () => {
    if (!taxData) {
      toast({
        title: "No Data",
        description: "No tax data available to generate files.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    
    try {
      // Call the API to generate tax files
      const updatedData = await taxApi.generateTaxFiles(taxData);
      setTaxData(updatedData);
      setGenerated(true);
      
      toast({
        title: "Generation Complete",
        description: "Tax files have been successfully generated.",
      });
    } catch (error) {
      console.error("Error generating tax files:", error);
      toast({
        title: "Generation Error",
        description: "An error occurred while generating the tax files.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleComplete = () => {
    if (!generated) {
      toast({
        title: "Generation Required",
        description: "Please generate the tax files before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    onComplete();
    toast({
      title: "Step Completed",
      description: "File generation step completed successfully.",
    });
  };

  const formatFormType = (formType: string) => {
    if (formType === '1065') return 'Form 1065 (Partnership Return)';
    if (formType === 'K-1') return 'Schedule K-1 (Partner\'s Share)';
    return formType;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>File Generation</CardTitle>
          <CardDescription>Generate tax forms for {taxData?.entityName || "Selected SPV"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {taxData ? (
            <>
              <div className="mb-6">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertTitle>Tax Files</AlertTitle>
                  <AlertDescription>
                    We'll generate all required tax forms for {taxData.entityName}, including entity returns and investor K-1s.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="grid gap-4">
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
                            <Download className="h-4 w-4 mr-1" /> Preview
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
                
                {taxData.investors.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-medium">Investor K-1 Summary</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {taxData.investors.length} investor K-1s will be generated.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              <div className="flex justify-between mt-6">
                <Button 
                  onClick={generateFiles} 
                  disabled={generating || generated}
                >
                  {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {generated ? "Files Generated" : "Generate Tax Files"}
                </Button>
                
                <Button 
                  onClick={handleComplete} 
                  disabled={!generated}
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

export default FileGeneration;
