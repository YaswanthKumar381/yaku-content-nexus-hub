
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$19",
      period: "/month",
      description: "Perfect for individual creators and small projects",
      features: [
        "Upload up to 100 content pieces",
        "Basic AI chat functionality",
        "5 connected social accounts",
        "Standard processing speed",
        "Email support"
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "Ideal for growing creators and marketing teams",
      features: [
        "Upload up to 1,000 content pieces",
        "Advanced AI insights & analytics",
        "Unlimited social account connections",
        "Priority processing speed",
        "Advanced search & filtering",
        "API access",
        "Priority support"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "$149",
      period: "/month",
      description: "For large teams and organizations",
      features: [
        "Unlimited content uploads",
        "Custom AI model training",
        "White-label options",
        "Advanced team collaboration",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 phone support",
        "SLA guarantee"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Simple, <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Transparent Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your content needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative border-2 ${plan.popular ? 'border-purple-500 shadow-2xl scale-105' : 'border-gray-200 shadow-xl'} hover:shadow-2xl transition-all duration-300 bg-white`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-12">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-lg">{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 text-lg font-semibold rounded-full transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-purple-500/25 transform hover:scale-105' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">All plans include SSL security, automatic backups, and GDPR compliance</p>
          <p className="text-sm text-gray-500">
            Need a custom solution? <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">Contact our sales team</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
