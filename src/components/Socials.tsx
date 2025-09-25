"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Twitter, ExternalLink, Users } from "lucide-react";

const Socials = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Join the <span className="text-primary">Community</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Connect with other holders, creators, and stay updated on the latest Viewheel developments
          </p>
        </div>

        {/* Social Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-12">
          <Card className="bg-viewheel-card border-viewheel-border hover:border-primary/50 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-all duration-300">
                  <Twitter className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">Follow on X</h3>
              <p className="text-muted-foreground mb-6">
                Get real-time updates, announcements, and connect with the Viewheel community
              </p>
              <Button 
                variant="outline" 
                className="bg-background/50 border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                onClick={() => window.open('https://x.com/viewheel', '_blank')}
              >
                <Twitter className="mr-2 h-4 w-4" />
                Follow @Viewheel
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* <Card className="bg-viewheel-card border-viewheel-border hover:border-primary/50 transition-all duration-300 hover:scale-105 group">
            <CardContent className="p-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition-all duration-300">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">Join Telegram</h3>
              <p className="text-muted-foreground mb-6">
                Chat with holders, ask questions, and participate in community discussions
              </p>
              <Button 
                variant="outline" 
                className="bg-background/50 border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                onClick={() => window.open('https://t.me/viewheel', '_blank')}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Join Chat
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card> */}
        </div>

        {/* Community Stats */}
        <div className="bg-viewheel-card/50 border border-viewheel-border rounded-xl p-8 backdrop-blur-sm">
          <div className="flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-primary mr-3" />
            <h3 className="text-2xl font-bold text-foreground">Growing Community</h3>
          </div>
          <p className="text-muted-foreground mb-6">
            Join thousands of $VIEWS holders and content creators building the future of viewership networks
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">0</div>
              <div className="text-muted-foreground">Token Holders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Active Community</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Socials;