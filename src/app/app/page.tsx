// src/app/app/page.tsx
"use client";

import { useState } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Clock, DollarSign, Send, Wallet, Check } from "lucide-react";
import { WalletButton } from "@/components/wallet/WalletButton";

const AppPage = () => {
  const { connected, publicKey } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      number: 1,
      title: "Upload Content",
      description: "Upload your video advertisement (MP4 format)",
      icon: Upload,
      completed: currentStep > 1
    },
    {
      number: 2,
      title: "Choose Timeframe",
      description: "Select when you want your ad to air on the livestream",
      icon: Clock,
      completed: currentStep > 2
    },
    {
      number: 3,
      title: "Pay & Submit",
      description: "Pay in $VIEWS tokens and submit your advertisement",
      icon: DollarSign,
      completed: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Wallet Connect */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary animate-float">
              <span className="text-primary font-bold">V</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-primary">VIEWHEEL</span>
          </div>
          
          {!connected ? (
            <WalletButton variant="header" />
          ) : (
            <WalletButton variant="header" />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          {!connected ? (
            // Wallet Connection Required State
            <div className="text-center py-20">
              <div className="mb-8">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
                  <Wallet className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Queue Your <span className="text-primary">Advertisement</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Connect your wallet to start the streamlined process of getting your content on the Viewheel livestream
                </p>
              </div>
              
              <WalletButton variant="main" />
            </div>
          ) : (
            // Connected State - Show Upload Flow
            <div>
              {/* Page Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Queue Your <span className="text-primary">Advertisement</span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  Follow these steps to get your content on the Viewheel livestream
                </p>
              </div>

              {/* Progress Steps */}
              <div className="mb-12">
                <div className="flex flex-col lg:flex-row gap-6">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex-1">
                      <Card className={`border-2 transition-all duration-300 ${
                        currentStep === step.number 
                          ? 'border-primary bg-primary/5' 
                          : step.completed 
                            ? 'border-primary/50 bg-viewheel-card' 
                            : 'border-viewheel-border bg-viewheel-card opacity-60'
                      }`}>
                        <CardContent className="p-6 text-center">
                          <div className="mb-4 flex justify-center">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                              step.completed 
                                ? 'bg-primary border-primary text-primary-foreground' 
                                : currentStep === step.number
                                  ? 'bg-primary/20 border-primary text-primary'
                                  : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                            }`}>
                              {step.completed ? (
                                <Check className="h-8 w-8" />
                              ) : (
                                <step.icon className="h-8 w-8" />
                              )}
                            </div>
                          </div>
                          <div className={`mb-2 text-lg font-semibold ${
                            currentStep === step.number ? 'text-primary' : 'text-foreground'
                          }`}>
                            {step.number}. {step.title}
                          </div>
                          <p className="text-muted-foreground text-sm">{step.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Step Content */}
              <Card className="bg-viewheel-card border-viewheel-border">
                <CardContent className="p-8">
                  {currentStep === 1 && (
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-foreground mb-4">Upload Your Video</h3>
                      <p className="text-muted-foreground mb-8">
                        Upload your advertisement video in MP4 format (max 100MB)
                      </p>
                      
                      <div className="border-2 border-dashed border-viewheel-border rounded-lg p-12 hover:border-primary/50 transition-colors">
                        <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                          Drag and drop your video here, or click to browse
                        </p>
                        <Button variant="outline" className="border-primary/50 hover:bg-primary hover:text-primary-foreground">
                          Choose File
                        </Button>
                      </div>
                      
                      <div className="mt-8">
                        <Button 
                          onClick={() => setCurrentStep(2)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                        >
                          Continue to Timeframe
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-foreground mb-4">Choose Your Timeframe</h3>
                      <p className="text-muted-foreground mb-8">
                        Select when you want your advertisement to air on the livestream
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                        <Card className="border-viewheel-border hover:border-primary/50 cursor-pointer transition-all">
                          <CardContent className="p-6">
                            <h4 className="font-semibold text-foreground mb-2">Peak Hours</h4>
                            <p className="text-muted-foreground text-sm mb-2">6 PM - 12 AM EST</p>
                            <p className="text-primary font-bold">Higher visibility</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-viewheel-border hover:border-primary/50 cursor-pointer transition-all">
                          <CardContent className="p-6">
                            <h4 className="font-semibold text-foreground mb-2">Off-Peak Hours</h4>
                            <p className="text-muted-foreground text-sm mb-2">12 AM - 6 PM EST</p>
                            <p className="text-primary font-bold">Lower cost</p>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="mt-8 flex gap-4 justify-center">
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentStep(1)}
                          className="border-viewheel-border"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={() => setCurrentStep(3)}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-foreground mb-4">Review & Pay</h3>
                      <p className="text-muted-foreground mb-8">
                        Review your advertisement details and complete payment to submit
                      </p>
                      
                      {/* Review Section */}
                      <div className="bg-viewheel-card/50 border border-viewheel-border rounded-xl p-6 text-left max-w-md mx-auto mb-8">
                        <h4 className="text-lg font-semibold text-foreground mb-4 text-center">Advertisement Summary</h4>
                        <div className="space-y-4">
                          <div>
                            <p className="text-muted-foreground text-sm">Video</p>
                            <p className="text-foreground font-medium">advertisement.mp4</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-sm">Timeframe</p>
                            <p className="text-foreground font-medium">Peak Hours (6 PM - 12 AM EST)</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground text-sm">Duration</p>
                            <p className="text-foreground font-medium">30 seconds</p>
                          </div>
                          <div className="border-t border-viewheel-border pt-4">
                            <p className="text-muted-foreground text-sm">Total Cost</p>
                            <p className="text-3xl font-bold text-primary">1,250 $VIEWS</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Helios Placeholder */}
                      <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-6 mb-8">
                        <p className="text-foreground font-semibold mb-2">Helios Payment Widget</p>
                        <p className="text-muted-foreground text-sm">Payment integration coming soon</p>
                      </div>
                      
                      <div className="mt-8 flex gap-4 justify-center">
                        <Button 
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="border-viewheel-border"
                        >
                          Back
                        </Button>
                        <Button 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Pay & Submit Advertisement
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AppPage;