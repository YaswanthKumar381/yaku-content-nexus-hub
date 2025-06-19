
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Sample projects data - in a real app this would come from a backend
  const projects = [
    {
      id: 1,
      title: "New Project",
      image: "/placeholder.svg",
      timeAgo: "8 minutes ago"
    },
    {
      id: 2,
      title: "New Project", 
      image: "/placeholder.svg",
      timeAgo: "3 days ago"
    },
    {
      id: 3,
      title: "New Project",
      image: "/placeholder.svg", 
      timeAgo: "3 days ago"
    },
    {
      id: 4,
      title: "New Project",
      image: "/placeholder.svg",
      timeAgo: "3 days ago"
    }
  ];

  const handleNewProject = () => {
    navigate('/canvas');
  };

  const handleProjectClick = (projectId: number) => {
    // For now, all projects navigate to canvas
    navigate('/canvas');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-black">Yaku</div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-8">
            <button className="text-black font-medium border-b-2 border-black pb-1">
              Projects
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                Free Plan
              </span>
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
              className="pl-10 bg-white border-gray-200 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {projects.map((project) => (
            <Card 
              key={project.id}
              className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardContent className="p-0">
                {/* Project Image */}
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Overlay with menu dots */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 bg-white/80 hover:bg-white rounded-full"
                    >
                      <div className="flex flex-col space-y-0.5">
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      </div>
                    </Button>
                  </div>
                </div>
                
                {/* Project Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-500">{project.timeAgo}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Project Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleNewProject}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-8 py-3 rounded-lg text-base transition-colors duration-200 flex items-center space-x-2"
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
