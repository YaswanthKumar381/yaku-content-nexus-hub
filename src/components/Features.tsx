
import { Card, CardContent } from "@/components/ui/card";
import { Upload, MessageSquare, Link, Image, Youtube, Facebook, Instagram } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Upload,
      title: "Universal Content Upload",
      description: "Upload any type of content - videos, audio, images, text, PDFs, and more. Our AI understands it all.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Link,
      title: "Social Media Integration",
      description: "Connect YouTube videos, Instagram reels, TikTok content, Facebook ads, and Twitter posts instantly.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: MessageSquare,
      title: "Intelligent Chat Interface",
      description: "Ask questions, get insights, and discover connections across all your content through natural conversation.",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: Image,
      title: "Cross-Platform Analytics",
      description: "Understand your content performance across all platforms with AI-powered insights and recommendations.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const supportedPlatforms = [
    { icon: Youtube, name: "YouTube", color: "text-red-500" },
    { icon: Instagram, name: "Instagram", color: "text-pink-500" },
    { icon: Facebook, name: "Facebook", color: "text-blue-500" },
    { name: "TikTok", color: "text-purple-500" },
    { name: "Twitter", color: "text-cyan-500" },
    { name: "LinkedIn", color: "text-blue-600" }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            One Platform, <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Infinite Possibilities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Yake.do breaks down content silos and creates a unified intelligence layer across all your digital assets.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Supported Platforms */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Supports All Major Platforms</h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {supportedPlatforms.map((platform, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300">
                {platform.icon && <platform.icon className={`h-6 w-6 ${platform.color}`} />}
                <span className="font-semibold text-gray-800">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
