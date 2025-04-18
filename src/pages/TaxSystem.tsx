import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import DataCollection from "@/components/tax/DataCollection";
import DataProcessing from "@/components/tax/DataProcessing";
import FileGeneration from "@/components/tax/FileGeneration";
import FileDistribution from "@/components/tax/FileDistribution";
import Approval from "@/components/tax/Approval";
import EFileSubmission from "@/components/tax/EFileSubmission";
import SystemOverview from "@/components/tax/SystemOverview";

const TaxSystem = () => {
  const [currentTab, setCurrentTab] = useState("data-collection");
  const [taxData, setTaxData] = useState({
    collected: false,
    processed: false,
    filesGenerated: false,
    filesDistributed: false,
    approved: false,
    submitted: false
  });

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const updateTaxStatus = (status: Partial<typeof taxData>) => {
    setTaxData(prev => ({ ...prev, ...status }));
    toast({
      title: "Status Updated",
      description: "Tax process status has been updated successfully.",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Tax System POC</h1>
      
      {/* System Overview Component */}
      <SystemOverview />
      
      <Card>
        <CardHeader>
          <CardTitle>SPV Tax Management (Test Environment)</CardTitle>
          <CardDescription>
            Test environment for managing SPV tax processes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="data-collection" value={currentTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger 
                value="data-collection"
                disabled={false}
              >
                1. Data Collection
              </TabsTrigger>
              <TabsTrigger 
                value="data-processing"
                disabled={!taxData.collected}
              >
                2. Processing
              </TabsTrigger>
              <TabsTrigger 
                value="file-generation"
                disabled={!taxData.processed}
              >
                3. Generation
              </TabsTrigger>
              <TabsTrigger 
                value="file-distribution"
                disabled={!taxData.filesGenerated}
              >
                4. Distribution
              </TabsTrigger>
              <TabsTrigger 
                value="approval"
                disabled={!taxData.filesDistributed}
              >
                5. Approval
              </TabsTrigger>
              <TabsTrigger 
                value="e-file-submission"
                disabled={!taxData.approved}
              >
                6. E-File
              </TabsTrigger>
            </TabsList>

            <TabsContent value="data-collection">
              <DataCollection 
                onComplete={() => updateTaxStatus({ collected: true })}
              />
            </TabsContent>
            
            <TabsContent value="data-processing">
              <DataProcessing 
                onComplete={() => updateTaxStatus({ processed: true })}
              />
            </TabsContent>
            
            <TabsContent value="file-generation">
              <FileGeneration 
                onComplete={() => updateTaxStatus({ filesGenerated: true })}
              />
            </TabsContent>
            
            <TabsContent value="file-distribution">
              <FileDistribution 
                onComplete={() => updateTaxStatus({ filesDistributed: true })}
              />
            </TabsContent>
            
            <TabsContent value="approval">
              <Approval 
                onComplete={() => updateTaxStatus({ approved: true })}
              />
            </TabsContent>
            
            <TabsContent value="e-file-submission">
              <EFileSubmission 
                onComplete={() => updateTaxStatus({ submitted: true })}
              />
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex justify-end space-x-4">
            <Button 
              variant="outline"
              onClick={() => {
                const tabs = ["data-collection", "data-processing", "file-generation", "file-distribution", "approval", "e-file-submission"];
                const currentIndex = tabs.indexOf(currentTab);
                if (currentIndex > 0) {
                  setCurrentTab(tabs[currentIndex - 1]);
                }
              }}
              disabled={currentTab === "data-collection"}
            >
              Previous Step
            </Button>
            
            <Button 
              onClick={() => {
                const tabs = ["data-collection", "data-processing", "file-generation", "file-distribution", "approval", "e-file-submission"];
                const currentIndex = tabs.indexOf(currentTab);
                if (currentIndex < tabs.length - 1) {
                  const requiredStatus = [
                    "collected", "processed", "filesGenerated", 
                    "filesDistributed", "approved"
                  ][currentIndex];
                  
                  if (taxData[requiredStatus as keyof typeof taxData]) {
                    setCurrentTab(tabs[currentIndex + 1]);
                  } else {
                    toast({
                      title: "Step Incomplete",
                      description: "Please complete the current step before proceeding.",
                      variant: "destructive"
                    });
                  }
                }
              }}
              disabled={currentTab === "e-file-submission" && taxData.submitted}
            >
              {currentTab === "e-file-submission" ? "Finish Tax Process" : "Next Step"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxSystem;
