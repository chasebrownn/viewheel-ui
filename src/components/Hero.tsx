"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle, Upload, ExternalLink } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-viewheel-card"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/15 rounded-full blur-2xl animate-float" style={{ animationDelay: "-1s" }}></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent animate-glow-pulse">
            VIEWHEEL
          </h1>
          <div className="mt-4 text-xl md:text-2xl text-muted-foreground font-medium">
            Get paid for your <span className="text-primary font-bold">$VIEWS</span>
          </div>
        </div>

        {/* Tagline */}
        <div className="mb-12">
          <p className="text-xl md:text-2xl text-foreground/90 mb-4">
            The first community-owned viewership network
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Pay in <span className="text-primary font-semibold">$VIEWS</span> to get your content on the livestream. 
            Top holders get proportional airdrops from advertiser payments.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            size="lg" 
            className="group relative px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            <PlayCircle className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
            Attend Livestream
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
          </Button>
          
          <Button 
            asChild
            size="lg" 
            variant="outline"
            className="group px-8 py-6 text-lg font-semibold bg-background/50 hover:bg-viewheel-card border-2 border-primary/50 hover:border-primary text-primary hover:text-primary-foreground hover:bg-primary transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
          >
            <Link href="/app">
              <Upload className="mr-2 h-6 w-6 group-hover:scale-110 transition-transform" />
              Queue Your Ad
              <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
            </Link>
          </Button>
        </div>

        {/* Stats/Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">Top 500</div>
            <div className="text-muted-foreground">Holders get airdrops</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">$VIEWS</div>
            <div className="text-muted-foreground">Native payment token</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-muted-foreground">Live streaming</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;