
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: [
      "Features",
      "Pricing",
      "API Documentation",
      "Integrations",
      "Security"
    ],
    Company: [
      "About",
      "Blog",
      "Careers",
      "Press",
      "Contact"
    ],
    Resources: [
      "Help Center",
      "Community",
      "Tutorials",
      "Webinars",
      "Status"
    ],
    Legal: [
      "Privacy Policy",
      "Terms of Service",
      "Cookie Policy",
      "GDPR",
      "Compliance"
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Content Strategy?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of content creators and marketers who've already revolutionized their workflow with Yaku.do
          </p>
          <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105">
            Start Your Free Trial Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Yaku.do
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The AI-powered platform that unifies all your content and transforms how you interact with your digital assets.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                <span className="text-sm font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                <span className="text-sm font-bold">in</span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                <span className="text-sm font-bold">ig</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © 2024 Yaku.do. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
