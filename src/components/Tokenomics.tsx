import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Percent, Users, ArrowRight, DollarSign } from "lucide-react";

const Tokenomics = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-viewheel-card/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            <span className="text-primary">$VIEWS</span> Tokenomics
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A sustainable ecosystem where value flows directly to the community that builds it
          </p>
        </div>

        {/* Value Flow */}
        <div className="mb-16">
          <div className="bg-viewheel-card border border-viewheel-border rounded-xl p-8">
            <h3 className="text-2xl font-bold text-center text-foreground mb-8">Value Flow Cycle</h3>
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                  <DollarSign className="h-10 w-10 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Advertisers Pay</h4>
                <p className="text-muted-foreground">Content creators pay $VIEWS for livestream time</p>
              </div>
              
              <ArrowRight className="h-8 w-8 text-primary rotate-90 lg:rotate-0" />
              
              <div className="flex-1 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Holders Earn</h4>
                <p className="text-muted-foreground">Top 500 holders receive proportional airdrops</p>
              </div>
              
              <ArrowRight className="h-8 w-8 text-primary rotate-90 lg:rotate-0" />
              
              <div className="flex-1 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary">
                  <Percent className="h-10 w-10 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">Value Increases</h4>
                <p className="text-muted-foreground">More demand drives $VIEWS token value up</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-viewheel-card border-viewheel-border hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">For Holders</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Earn proportional airdrops from all advertiser payments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Watch content and add value to your own investment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Top 500 holders qualify for rewards</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Community-owned network governance</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-viewheel-card border-viewheel-border hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">For Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Guaranteed livestream exposure for your content</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>24/7 active viewership network</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Transparent, community-driven platform</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Direct payment in $VIEWS tokens</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;