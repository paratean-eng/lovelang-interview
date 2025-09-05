import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  Clock, 
  Star, 
  TrendingUp, 
  Play, 
  Download,
  Award,
  Target,
  Zap
} from 'lucide-react';

const Results: React.FC = () => {
  // Mock data for demonstration
  const mockResults = {
    overallScore: 85,
    totalInterviews: 12,
    averageScore: 78,
    improvementRate: 15,
    recentInterviews: [
      {
        id: 1,
        date: '2024-01-15',
        score: 92,
        duration: '45 min',
        feedback: 'Excellent communication skills and clear answers',
        topics: ['Leadership', 'Problem Solving', 'Technical Skills']
      },
      {
        id: 2,
        date: '2024-01-10',
        score: 78,
        duration: '38 min',
        feedback: 'Good responses, could improve on specific examples',
        topics: ['Teamwork', 'Adaptability', 'Communication']
      },
      {
        id: 3,
        date: '2024-01-05',
        score: 85,
        duration: '42 min',
        feedback: 'Strong technical knowledge, work on confidence',
        topics: ['Technical Skills', 'Problem Solving']
      }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-primary';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 75) return 'secondary';
    return 'outline';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 p-4">
      <div className="max-w-6xl mx-auto py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Interview Results
              </span>
            </h1>
            <p className="text-muted-foreground">Track your progress and improve your interview skills</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/interview">
              <Button className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-purple">
                <Play className="w-4 h-4 mr-2" />
                Start New Interview
              </Button>
            </Link>
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(mockResults.overallScore)}`}>
                  {mockResults.overallScore}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Interviews</p>
                <p className="text-3xl font-bold text-foreground">{mockResults.totalInterviews}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Average Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(mockResults.averageScore)}`}>
                  {mockResults.averageScore}%
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Improvement</p>
                <p className="text-3xl font-bold text-success">+{mockResults.improvementRate}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Interviews */}
        <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Recent Interviews</h2>
            <Button variant="ghost" className="text-primary hover:bg-primary/10">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {mockResults.recentInterviews.map((interview) => (
              <div
                key={interview.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-accent/10 border border-primary/10 hover:bg-accent/20 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <Badge variant={getScoreBadgeVariant(interview.score)} className="text-sm">
                      Score: {interview.score}%
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {interview.duration}
                    </div>
                    <span className="text-sm text-muted-foreground">{interview.date}</span>
                  </div>
                  <p className="text-foreground mb-2">{interview.feedback}</p>
                  <div className="flex flex-wrap gap-2">
                    {interview.topics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0 md:ml-4">
                  <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                    <Play className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:bg-muted/50">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-card hover:shadow-purple transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mr-4">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Practice More</h3>
                <p className="text-muted-foreground">Keep improving your skills</p>
              </div>
            </div>
            <Link to="/interview">
              <Button className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-purple">
                Start Practice Session
              </Button>
            </Link>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/20 to-accent/10 border-primary/20 shadow-card hover:shadow-purple transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center mr-4">
                <BarChart3 className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Detailed Analytics</h3>
                <p className="text-muted-foreground">Coming soon - Deep insights</p>
              </div>
            </div>
            <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10" disabled>
              View Analytics
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Results;