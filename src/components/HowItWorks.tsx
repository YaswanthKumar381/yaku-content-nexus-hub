
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Search, MessageSquare } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      icon: Upload,
      title: "Upload & Connect",
      description: "Upload your content or connect your social media accounts. Videos, audio, images, text - everything is welcome.",
      color: "purple"
    },
    {
      step: "02",
      icon: Search,
      title: "AI Processing",
      description: "Our advanced AI analyzes and understands your content, creating connections and extracting insights automatically.",
      color: "blue"
    },
    {
      step: "03",
      icon: MessageSquare,
      title: "Chat & Discover",
      description: "Ask questions, find patterns, and get insights from all your content through natural conversation.",
      color: "green"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            How <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Yashu.do</span> Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Three simple steps to transform your content chaos into organized intelligence.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-200 via-blue-200 to-green-200 transform -translate-y-1/2"></div>
          
          <div className="grid lg:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                  <CardContent className="p-8 text-center relative">
                    {/* Step Number */}
                    <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r ${
                      step.color === 'purple' ? 'from-purple-500 to-purple-600' :
                      step.color === 'blue' ? 'from-blue-500 to-blue-600' :
                      'from-green-500 to-green-600'
                    } flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-sm">{step.step}</span>
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-20 h-20 mx-auto mb-6 mt-4 rounded-2xl bg-gradient-to-r ${
                      step.color === 'purple' ? 'from-purple-100 to-purple-200' :
                      step.color === 'blue' ? 'from-blue-100 to-blue-200' :
                      'from-green-100 to-green-200'
                    } flex items-center justify-center`}>
                      <step.icon className={`h-10 w-10 ${
                        step.color === 'purple' ? 'text-purple-600' :
                        step.color === 'blue' ? 'text-blue-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-gray-600 mb-4">Ready to get started?</p>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
