
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowDownUp, FileText, Upload, CheckCircle, FileUp } from "lucide-react";

const SystemOverview = () => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Tax System POC Overview</CardTitle>
        <CardDescription>Test environment for SPV tax management workflow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { 
                id: 1,
                title: "Data Collection", 
                icon: <ArrowDownUp className="h-5 w-5 text-blue-500" />,
                description: "Test data collection process" 
              },
              { 
                id: 2,
                title: "Data Processing", 
                icon: <FileText className="h-5 w-5 text-indigo-500" />,
                description: "Simulate data processing" 
              },
              { 
                id: 3,
                title: "File Generation", 
                icon: <FileText className="h-5 w-5 text-purple-500" />,
                description: "Generate sample forms" 
              },
              { 
                id: 4,
                title: "File Distribution", 
                icon: <Upload className="h-5 w-5 text-pink-500" />,
                description: "Test distribution flow" 
              },
              { 
                id: 5,
                title: "Approval", 
                icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                description: "Sample approval process" 
              },
              { 
                id: 6,
                title: "E-File Submission", 
                icon: <FileUp className="h-5 w-5 text-orange-500" />,
                description: "Mock e-filing submission" 
              }
            ].map((step) => (
              <Card key={step.id} className="bg-slate-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-md shadow-sm">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{step.id}. {step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="p-4 bg-slate-100 rounded-md mt-6">
            <p className="text-sm text-center">
              This is a test environment using mock data to demonstrate the tax filing workflow.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemOverview;
