import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="text-center py-16">
        <h1 className="text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            404
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! Page not found</p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground rounded-lg hover:shadow-purple transition-all duration-300"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
