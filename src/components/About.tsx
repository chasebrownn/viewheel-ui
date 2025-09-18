import { Card, CardContent } from "@/components/ui/card";
import { Coins, Users, Zap, TrendingUp } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Coins,
      title: "Pay to Play",
      description: "Submit videos and pay in $VIEWS tokens to secure your time slot on the livestream"
    },
    {
      icon: Users,
      title: "Community Owned",
      description: "Top 500 holders receive proportional airdrops from all advertiser payments"
    },
    {
      icon: Zap,
      title: "Instant Rewards",
      description: "Watch Viewheel and add value to your own bag while earning from advertiser spend"
    },
    {
      icon: TrendingUp,
      title: "Growing Network",
      description: "More viewers = higher demand for $VIEWS = bigger airdrops for holders"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How <span className="text-primary">Viewheel</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A revolutionary viewership network where content creators pay to reach audiences, 
            and token holders earn from the ecosystem they help build.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-viewheel-card border-viewheel-border hover:border-primary/50 transition-all duration-300 hover:scale-105 group">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <feature.icon className="h-12 w-12 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Flow */}
        <div className="bg-viewheel-card/50 border border-viewheel-border rounded-xl p-8 backdrop-blur-sm">
          <h3 className="text-2xl font-bold text-center text-foreground mb-8">The Viewheel Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Upload & Pay</h4>
              <p className="text-muted-foreground">Creators upload videos and pay in $VIEWS for livestream slots</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Stream Live</h4>
              <p className="text-muted-foreground">Content plays on the 24/7 Viewheel livestream for viewers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/30">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">Earn Rewards</h4>
              <p className="text-muted-foreground">Top 500 holders receive proportional $VIEWS airdrops</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;