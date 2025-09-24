"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function UploadSuccessPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full bg-viewheel-card border-viewheel-border">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-14 w-14 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Upload Successful
          </h1>
          <p className="text-muted-foreground mb-8">
            Your video has been uploaded and queued. Thanks!
          </p>

          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline" className="border-viewheel-border">
              <Link href="/">Home</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/app">Upload another ad</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
