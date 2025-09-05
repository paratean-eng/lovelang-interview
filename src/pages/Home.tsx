import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, BarChart3, Mic, Video, Brain } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
              AI Interview
            </span>
            <br />
            <span className="text-foreground">Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the future of interviews with our AI-powered platform. 
            Record video responses, get real-time feedback, and improve your interview skills.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/interview">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-purple transition-all duration-300">
                <Play className="w-5 h-5 mr-2" />
                Start Interview
              </Button>
            </Link>
            <Link to="/results">
              <Button size="lg" variant="outline" className="border-primary/30 hover:bg-primary/10">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Results
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-card hover:shadow-purple transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4">
              <Mic className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Audio Recording</h3>
            <p className="text-muted-foreground">
              High-quality audio recording with noise cancellation for clear responses.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-card hover:shadow-purple transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Video Interview</h3>
            <p className="text-muted-foreground">
              Professional video recording with real-time preview and playback features.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-card hover:shadow-purple transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">AI Analysis</h3>
            <p className="text-muted-foreground">
              Advanced AI provides intelligent questions and detailed performance feedback.
            </p>
          </Card>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-muted-foreground">Interviews Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">95%</div>
            <div className="text-muted-foreground">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-muted-foreground">Available</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">AI</div>
            <div className="text-muted-foreground">Powered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;