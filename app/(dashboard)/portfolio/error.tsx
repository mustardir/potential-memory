"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-4 md:p-6">
      <Card className="glass-card mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Failed to load portfolio details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We ran into an issue while loading your portfolio data. Please try again.
          </p>
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
