
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:py-16">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          Allocations SPV Tax System
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
          Complete tax management system for Allocations SPVs, handling data collection,
          processing, file generation, distribution, approval, and e-filing.
        </p>
        <div className="space-x-4">
          <Button asChild size="lg">
            <Link to="/tax-system">Access Tax System</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
