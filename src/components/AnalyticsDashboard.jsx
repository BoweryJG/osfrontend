import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Avatar
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description'; 
import PsychologyIcon from '@mui/icons-material/Psychology';

// Mock data for the dashboard
const mockAnalyticsData = {
  totalReports: 427,
  activeUsers: 68,
  reportsTrend: '+23%',
  popularModels: [
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', usage: 245, percentage: 58 },
    { id: 'openai/gpt-4', name: 'GPT-4', usage: 124, percentage: 29 },
    { id: 'anthropic/claude-3', name: 'Claude 3', usage: 43, percentage: 10 },
    { id: 'meta/llama-3', name: 'Llama 3', usage: 15, percentage: 3 }
  ],
  popularPrompts: [
    { id: 'market-analysis', name: 'Market Analysis', usage: 215, percentage: 50 },
    { id: 'competitive-landscape', name: 'Competitive Landscape', usage: 156, percentage: 36 },
    { id: 'physician-brief', name: 'Physician Brief', usage: 56, percentage: 14 }
  ],
  recentActivity: [
    { user: 'Dr. Sarah Chen', action: 'Generated report', timestamp: '10 min ago', model: 'GPT-3.5 Turbo' },
    { user: 'Marcus Johnson', action: 'Shared report', timestamp: '43 min ago', model: 'GPT-4' },
    { user: 'Dr. James Wilson', action: 'Generated report', timestamp: '1 hour ago', model: 'Claude 3' },
    { user: 'Emily Rodriguez', action: 'Downloaded report', timestamp: '3 hours ago', model: 'GPT-3.5 Turbo' },
    { user: 'Dr. Michael Lee', action: 'Generated report', timestamp: '5 hours ago', model: 'Llama 3' }
  ]
};

const AnalyticsDashboard = ({ isAestheticMode = false }) => {
  return (
    <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, color: isAestheticMode ? '#fff' : 'text.primary', fontWeight: 600 }}>
        Analytics Dashboard
      </Typography>
      
      {/* Top metrics cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Total Reports"
            value={mockAnalyticsData.totalReports}
            icon={<DescriptionIcon />}
            trend={mockAnalyticsData.reportsTrend}
            isAestheticMode={isAestheticMode}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Active Users"
            value={mockAnalyticsData.activeUsers}
            icon={<PeopleIcon />}
            trend="+12%"
            isAestheticMode={isAestheticMode}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Reports This Month"
            value="136"
            icon={<TrendingUpIcon />}
            trend="+7%"
            isAestheticMode={isAestheticMode}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            title="Avg. Response Time"
            value="3.2s"
            icon={<PsychologyIcon />}
            trend="-0.4s"
            isAestheticMode={isAestheticMode}
            trendDirection="down"
          />
        </Grid>
      </Grid>
      
      {/* Main content area */}
      <Grid container spacing={3}>
        {/* Popular AI Models */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={isAestheticMode ? 0 : 2}
            sx={{
              p: 3,
              borderRadius: '12px',
              height: '100%',
              backgroundColor: isAestheticMode ? 'rgba(30, 30, 45, 0.5)' : 'background.paper',
              border: isAestheticMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, color: isAestheticMode ? '#fff' : 'text.primary' }}>
              Popular AI Models
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mockAnalyticsData.popularModels.map((model) => (
                <Box key={model.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: isAestheticMode ? '#ddd' : 'text.secondary' }}>
                      {model.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isAestheticMode ? '#ddd' : 'text.secondary' }}>
                      {model.usage} reports ({model.percentage}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={model.percentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: isAestheticMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: isAestheticMode ? 'rgba(138, 116, 249, 0.8)' : 'primary.main'
                      }
                    }} 
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        
        {/* Popular Prompts */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={isAestheticMode ? 0 : 2}
            sx={{
              p: 3, 
              borderRadius: '12px',
              height: '100%',
              backgroundColor: isAestheticMode ? 'rgba(30, 30, 45, 0.5)' : 'background.paper',
              border: isAestheticMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, color: isAestheticMode ? '#fff' : 'text.primary' }}>
              Popular Prompts
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {mockAnalyticsData.popularPrompts.map((prompt) => (
                <Box key={prompt.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: isAestheticMode ? '#ddd' : 'text.secondary' }}>
                      {prompt.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isAestheticMode ? '#ddd' : 'text.secondary' }}>
                      {prompt.usage} reports ({prompt.percentage}%)
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={prompt.percentage} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: isAestheticMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: isAestheticMode ? 'rgba(138, 116, 249, 0.8)' : 'primary.main'
                      }
                    }} 
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        
        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper 
            elevation={isAestheticMode ? 0 : 2}
            sx={{
              p: 3,
              borderRadius: '12px',
              backgroundColor: isAestheticMode ? 'rgba(30, 30, 45, 0.5)' : 'background.paper',
              border: isAestheticMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, color: isAestheticMode ? '#fff' : 'text.primary' }}>
              Recent Activity
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {mockAnalyticsData.recentActivity.map((activity, index) => (
                <React.Fragment key={index}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    py: 1.5,
                  }}>
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        mr: 2,
                        backgroundColor: isAestheticMode ? 'rgba(138, 116, 249, 0.3)' : 'primary.light' 
                      }}
                    >
                      {activity.user.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: isAestheticMode ? '#fff' : 'text.primary' }}>
                        {activity.user}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isAestheticMode ? '#aaa' : 'text.secondary' }}>
                        {activity.action} • {activity.timestamp} • Using {activity.model}
                      </Typography>
                    </Box>
                  </Box>
                  {index < mockAnalyticsData.recentActivity.length - 1 && (
                    <Divider sx={{ borderColor: isAestheticMode ? 'rgba(255, 255, 255, 0.1)' : 'divider' }} />
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon, trend, trendDirection = 'up', isAestheticMode }) => {
  return (
    <Card 
      elevation={isAestheticMode ? 0 : 2}
      sx={{ 
        height: '100%',
        backgroundColor: isAestheticMode ? 'rgba(30, 30, 45, 0.5)' : 'background.paper',
        borderRadius: '12px',
        border: isAestheticMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle2" sx={{ color: isAestheticMode ? '#aaa' : 'text.secondary' }}>
            {title}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: 40,
            height: 40,
            borderRadius: '10px',
            backgroundColor: isAestheticMode ? 'rgba(138, 116, 249, 0.2)' : 'primary.light',
            color: isAestheticMode ? 'rgba(138, 116, 249, 0.9)' : 'primary.main'
          }}>
            {icon}
          </Box>
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            mt: 2, 
            fontWeight: 600, 
            color: isAestheticMode ? '#fff' : 'text.primary',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          {value}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 1, 
            color: trendDirection === 'up' 
              ? (isAestheticMode ? '#6fdc8c' : 'success.main') 
              : (isAestheticMode ? '#f87171' : 'error.main')
          }}
        >
          {trend} {trendDirection === 'up' ? '↑' : '↓'} from last month
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
