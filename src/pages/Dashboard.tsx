
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, MoreHorizontal, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleNewProject = () => {
    navigate('/canvas');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-6 bg-gray-800 rounded-sm"></div>
                <div className="w-2 h-6 bg-gray-600 rounded-sm"></div>
                <div className="w-2 h-6 bg-gray-400 rounded-sm"></div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Yaku</h1>
            </div>
            
            <nav className="flex items-center space-x-8">
              <button className="text-gray-900 font-medium border-b-2 border-gray-900 pb-1">
                Projects
              </button>
              <button className="text-gray-500 hover:text-gray-900 font-medium">
                Instructions
              </button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>0</span>
              <span className="text-xs">Free Plan</span>
            </div>
            
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Demo Project */}
          <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-purple-100/50" />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 hover:bg-white">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">Untitled</h3>
                <p className="text-sm text-gray-500">5 minutes ago</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Project Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleNewProject}
            className="bg-orange-400 hover:bg-orange-500 text-white px-8 py-3 rounded-full font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
