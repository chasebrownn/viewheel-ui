"use client";

import { useState } from "react";
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Clock, DollarSign, Send, Wallet, Check } from "lucide-react";
import { WalletButton } from "@/components/wallet/WalletButton";
import ViewsCheckout from "@/components/payments/ViewsCheckout";
import { useRouter } from "next/navigation";

const AppPage = () => {
  const { connected, publicKey } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeframeError, setTimeframeError] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  // Calculate cost based on video duration (1000 $VIEWS per minute)
  const calculateCost = () => {
    if (!videoDuration) return 0;
    const minutes = Math.ceil(videoDuration / 60); // Round up to nearest minute
    return minutes * 1000;
  };

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get current date in YYYY-MM-DD format for min date
  const getCurrentDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Get max date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  // helper: upload to our API
  const uploadToDrive = async (txSig: string) => {
    if (!selectedFile) return;
    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("name", selectedFile.name);
    if (selectedDate && selectedTime) {
      fd.append("whenISO", new Date(`${selectedDate}T${selectedTime}`).toISOString());
    }
    fd.append("tx", txSig);
    // wallet is available via wallet adapter:
    // import { useWallet } from '@solana/wallet-adapter-react';
    // already at top of file; we can read publicKey here
    fd.append("wallet", publicKey?.toBase58() ?? "");

    const res = await fetch("/api/drive-upload", { method: "POST", body: fd });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Upload failed" }));
      throw new Error(error || "Upload failed");
    }
    return res.json();
  };

  // Validate selected datetime
  const validateTimeframe = () => {
    setTimeframeError('');
    
    if (!selectedDate || !selectedTime) {
      setTimeframeError('Please select both date and time');
      return false;
    }

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    
    // Check if selected time is in the past
    if (selectedDateTime <= now) {
      setTimeframeError('Selected time must be in the future');
      return false;
    }

    // Check if selected time is at least 2 hours from now
    const twoHoursFromNow = new Date(now.getTime() + (2 * 60 * 60 * 1000));
    if (selectedDateTime < twoHoursFromNow) {
      setTimeframeError('Please select a time at least 2 hours from now');
      return false;
    }

    return true;
  };

  // Format selected datetime for display
  const formatSelectedDateTime = () => {
    if (!selectedDate || !selectedTime) return '';
    
    const dateTime = new Date(`${selectedDate}T${selectedTime}`);
    return dateTime.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  // Function to get video duration
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      
      video.onerror = () => {
        reject(new Error('Failed to load video metadata'));
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  // File validation function
  const validateFile = async (file: File) => {
    setIsValidating(true);
    setUploadError('');

    try {
      // Check file type
      if (file.type !== 'video/mp4') {
        throw new Error('File must be in MP4 format');
      }

      // Check file size (1GB = 1,073,741,824 bytes)
      if (file.size > 1073741824) {
        throw new Error('File size must be less than 1GB');
      }

      // Check video duration
      const duration = await getVideoDuration(file);
      if (duration > 300) { // 5 minutes = 300 seconds
        throw new Error('Video duration must be less than 5 minutes');
      }

      // If all validations pass
      setSelectedFile(file);
      setVideoDuration(duration);
      setUploadError('');
      return true;
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'File validation failed');
      setSelectedFile(null);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    await validateFile(file);
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
                  {steps.map((step) => (
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
                        Upload your advertisement video in MP4 format (max 1GB, max 5 minutes)
                      </p>
                      
                      {/* File Upload Area */}
                      <div 
                        className={`border-2 border-dashed rounded-lg p-12 transition-colors ${
                          uploadError 
                            ? 'border-red-500 bg-red-500/5' 
                            : selectedFile
                              ? 'border-primary bg-primary/5'
                              : 'border-viewheel-border hover:border-primary/50'
                        }`}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                      >
                        {isValidating ? (
                          <div className="text-center">
                            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Validating video...</p>
                          </div>
                        ) : selectedFile ? (
                          <div className="text-center">
                            <Check className="h-16 w-16 text-primary mx-auto mb-4" />
                            <p className="text-foreground font-medium mb-2">{selectedFile.name}</p>
                            <p className="text-muted-foreground text-sm mb-4">
                              Size: {formatFileSize(selectedFile.size)}
                            </p>
                            <Button 
                              variant="outline" 
                              className="border-primary/50 hover:bg-primary hover:text-primary-foreground"
                              onClick={() => {
                                setSelectedFile(null);
                                setUploadError('');
                              }}
                            >
                              Choose Different File
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                              Drag and drop your MP4 video here, or click to browse
                            </p>
                            <p className="text-sm text-muted-foreground mb-4">
                              Requirements: MP4 format • Max 1GB • Max 5 minutes
                            </p>
                            <input
                              type="file"
                              accept="video/mp4"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileSelect(file);
                              }}
                              className="hidden"
                              id="file-upload"
                            />
                            <label htmlFor="file-upload">
                              <Button 
                                variant="outline" 
                                className="border-primary/50 hover:bg-primary hover:text-primary-foreground cursor-pointer"
                                asChild
                              >
                                <span>Choose File</span>
                              </Button>
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Error Message */}
                      {uploadError && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <p className="text-red-400 text-sm font-medium">{uploadError}</p>
                        </div>
                      )}
                      
                      <div className="mt-8">
                        <Button 
                          onClick={() => setCurrentStep(2)}
                          disabled={!selectedFile || isValidating}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        Select the date and time you want your advertisement to air on the livestream
                      </p>
                      
                      <div className="max-w-md mx-auto mb-8">
                        <div className="grid grid-cols-1 gap-6">
                          {/* Date Selection */}
                          <div className="text-left">
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Date
                            </label>
                            <input
                              type="date"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              min={getCurrentDate()}
                              max={getMaxDate()}
                              className="w-full px-4 py-3 bg-viewheel-card border border-viewheel-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>

                          {/* Time Selection */}
                          <div className="text-left">
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Time (Your Local Time)
                            </label>
                            <input
                              type="time"
                              value={selectedTime}
                              onChange={(e) => setSelectedTime(e.target.value)}
                              className="w-full px-4 py-3 bg-viewheel-card border border-viewheel-border rounded-lg text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>
                        </div>

                        {/* Selected DateTime Preview */}
                        {selectedDate && selectedTime && !timeframeError && (
                          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Selected Airtime:</p>
                            <p className="text-foreground font-medium">{formatSelectedDateTime()}</p>
                          </div>
                        )}

                        {/* Error Message */}
                        {timeframeError && (
                          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-400 text-sm font-medium">{timeframeError}</p>
                          </div>
                        )}

                        {/* Pricing Info */}
                        <div className="mt-6 p-4 bg-viewheel-card/50 border border-viewheel-border rounded-lg">
                          <h4 className="text-sm font-medium text-foreground mb-2">Pricing Information</h4>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>• Simple pricing: <span className="text-primary font-semibold">1,000 $VIEWS per minute</span></p>
                            <p>• Duration is rounded up to the nearest minute</p>
                            {selectedFile && videoDuration > 0 && (
                              <p className="text-foreground font-medium mt-2">
                                Your video ({formatDuration(videoDuration)}) = <span className="text-primary">{calculateCost().toLocaleString()} $VIEWS</span>
                              </p>
                            )}
                          </div>
                        </div>
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
                          onClick={() => {
                            if (validateTimeframe()) {
                              setCurrentStep(3);
                            }
                          }}
                          disabled={!selectedDate || !selectedTime}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 disabled:opacity-50 disabled:cursor-not-allowed"
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

                      {/* Advertisement Summary (now *is* the checkout) */}
                      <Card className="bg-viewheel-card border-viewheel-border max-w-md mx-auto">
                        <CardContent className="p-6">
                          <h4 className="text-lg font-semibold text-foreground mb-4 text-center">
                            Advertisement Summary
                          </h4>

                          <div className="space-y-4 text-left">
                            <div>
                              <p className="text-muted-foreground text-sm">Video</p>
                              <p className="text-foreground font-medium">
                                {selectedFile ? selectedFile.name : "advertisement.mp4"}
                              </p>
                              {selectedFile && (
                                <p className="text-muted-foreground text-xs">
                                  {formatFileSize(selectedFile.size)}
                                </p>
                              )}
                            </div>

                            <div>
                              <p className="text-muted-foreground text-sm">Timeframe</p>
                              <p className="text-foreground font-medium">
                                {selectedDate && selectedTime
                                  ? formatSelectedDateTime()
                                  : "Peak Hours (6 PM - 12 AM EST)"}
                              </p>
                            </div>

                            <div>
                              <p className="text-muted-foreground text-sm">Duration</p>
                              <p className="text-foreground font-medium">
                                {videoDuration > 0 ? formatDuration(videoDuration) : "—"}
                              </p>
                            </div>

                            <div className="border-t border-viewheel-border pt-4">
                              <p className="text-muted-foreground text-sm">Total Cost</p>
                              <p className="text-3xl font-bold text-primary">
                                {calculateCost().toLocaleString()} $VIEWS
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {Math.ceil((videoDuration || 30) / 60)} minute(s) × 1,000 $VIEWS
                              </p>
                            </div>
                          </div>

                          {/* Checkout lives inside the summary */}
                          <div className="mt-6">
                            <ViewsCheckout
                              amount={calculateCost()}
                              disabled={isUploading}
                              onPaid={async (sig) => {
                                try {
                                  setIsUploading(true);
                                  const uploading = (await import("sonner")).toast.loading(
                                    "Uploading video…"
                                  );
                                  await uploadToDrive(sig);
                                  (await import("sonner")).toast.success("Upload complete ✅");
                                  (await import("sonner")).toast.dismiss(uploading);
                                  router.push("/app/success");
                                } catch (err: unknown) {
                                  const { toast } = await import("sonner");
                                  const msg = err instanceof Error ? err.message : String(err);
                                  toast.error("Upload failed", { description: msg });
                                  setIsUploading(false);
                                }
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Bottom actions: keep only Back */}
                      <div className="mt-8 flex gap-4 justify-center">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(2)}
                          className="border-viewheel-border"
                        >
                          Back
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