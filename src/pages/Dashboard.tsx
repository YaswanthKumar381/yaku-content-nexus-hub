
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, LayoutGrid, User, LogOut, Archive, Bell, MoreHorizontal } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Popular");
  const navigate = useNavigate();

  const tabs = ["Popular", "Concepting", "Design", "Marketing", "Moving Image", "Experimental"];

  const projects = [
    {
      title: "Abstract Motion Design",
      author: "Michelle Ma",
      image: "/placeholder.svg",
      category: "Motion"
    },
    {
      title: "Worldbuilding/Game UI",
      author: "Michelle Ma", 
      image: "/placeholder.svg",
      category: "UI/UX"
    },
    {
      title: "3D Abstract Illustration",
      author: "Daniil Filatov",
      image: "/placeholder.svg",
      category: "3D"
    },
    {
      title: "Product Hunt Landing",
      author: "Yining Shi",
      image: "/placeholder.svg",
      category: "Web"
    }
  ];

  const handleNewProject = () => {
    navigate('/canvas');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        {/* User Profile */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-zinc-300" />
            </div>
            <div>
              <p className="font-medium text-white">Yaswanth K</p>
              <p className="text-sm text-zinc-400">Starter Plan</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left bg-zinc-800 text-white hover:bg-zinc-700"
              onClick={handleNewProject}
            >
              <Plus className="w-4 h-4 mr-3" />
              New Project
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-left text-zinc-300 hover:text-white hover:bg-zinc-800">
              <LayoutGrid className="w-4 h-4 mr-3" />
              Projects
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-left text-zinc-300 hover:text-white hover:bg-zinc-800">
              <User className="w-4 h-4 mr-3" />
              Community
            </Button>
          </nav>
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-zinc-800">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-left text-zinc-300 hover:text-white hover:bg-zinc-800">
              <Archive className="w-4 h-4 mr-3" />
              Trash
            </Button>
            
            <Button variant="ghost" className="w-full justify-start text-left text-zinc-300 hover:text-white hover:bg-zinc-800">
              <Bell className="w-4 h-4 mr-3" />
              Help
            </Button>
          </nav>
          
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="text-xs text-zinc-500">Starter</div>
            <div className="text-xs text-zinc-400 mt-1">🔒 200</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Header */}
        <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold text-white">Projects</h1>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:ring-zinc-600"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-zinc-300 hover:text-white hover:bg-zinc-800">
                <LayoutGrid className="w-5 h-5" />
              </Button>
              
              <Button 
                className="bg-white text-black hover:bg-zinc-200"
                onClick={handleNewProject}
              >
                Create new project
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {/* Templates Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <LayoutGrid className="w-5 h-5 text-zinc-400" />
              <span className="text-zinc-400 font-medium">Templates</span>
            </div>

            <h2 className="text-3xl font-semibold text-white mb-2">Get Started</h2>
            <p className="text-zinc-400 mb-6">Discover new techniques and ideas with project templates</p>

            {/* Tabs */}
            <div className="flex space-x-6 mb-6 border-b border-zinc-800">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-white border-b-2 border-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map((project, index) => (
                <Card key={index} className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800 transition-colors cursor-pointer group">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-zinc-700 to-zinc-800 rounded-t-lg mb-4 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/50 hover:bg-black/70">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <h3 className="font-medium text-white mb-1 text-sm">{project.title}</h3>
                      <p className="text-zinc-400 text-xs">by {project.author}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Empty Project Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {[1, 2].map((item) => (
              <Card 
                key={item} 
                className="bg-zinc-900 border-zinc-800 border-dashed hover:bg-zinc-800 transition-colors cursor-pointer"
                onClick={handleNewProject}
              >
                <CardContent className="p-8 text-center">
                  <Plus className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                  <p className="text-zinc-400">Create new project</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
