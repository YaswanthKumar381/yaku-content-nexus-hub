
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/50 to-black"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-zinc-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-zinc-400/10 rounded-full blur-xl animate-pulse delay-500"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
              Yaku.do
            </h1>
            <div className="w-32 h-1 bg-white mx-auto rounded-full"></div>
          </div>
          
          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Chat with <span className="text-zinc-400">All Your Content</span> in One Place
          </h2>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform how you interact with your content. Upload videos, audio, images, text, and social media links. 
            Our AI creates a unified knowledge base you can chat with instantly.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-black hover:bg-zinc-200 px-8 py-4 text-lg font-semibold rounded-lg shadow-2xl transition-all duration-300 transform hover:scale-105">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-2 border-zinc-600 text-white hover:bg-zinc-900 px-8 py-4 text-lg font-semibold rounded-lg backdrop-blur-sm">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="text-zinc-500 mb-8">
            <p className="mb-4">Trusted by 10,000+ content creators and marketers</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold">YouTube</div>
              <div className="text-2xl font-bold">Instagram</div>
              <div className="text-2xl font-bold">TikTok</div>
              <div className="text-2xl font-bold">Facebook</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-zinc-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
