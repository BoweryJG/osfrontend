# repSpheres Frontend

A modern web application for medical sales representatives to generate AI-powered doctor reports.

## Features

- **AI Prompt Selection**: Choose from a variety of pre-defined prompts stored in Supabase
- **Market Intelligence**: Input market data about doctors and products
- **Sales Strategies**: Define sales approaches and success metrics
- **Doctor-Ready Reports**: Generate comprehensive reports using OpenRouter API
- **Modern UI**: Sleek, responsive interface with cosmic theme
- **Swipeable Navigation**: Carousel-style tabs powered by `react-swipeable-views`
- **Excel Import**: Upload `.xlsx` files to load market data
- **Menu Descriptions**: Clicking a menu icon now shows a short description before navigating
- **Procedure Dropdown**: Market Intel form includes an alphabetized procedure list from Supabase
- **Simplified Output Preview**: Shows a single expanded section for easier reading

## Technical Stack

- **Frontend**: React with Vite
- **UI Framework**: Material-UI (MUI)
- **Database**: Supabase
- **AI Integration**: OpenRouter API
- **State Management**: React Hooks
- **Styling**: CSS-in-JS with MUI's styling system

## Supabase Integration

The application connects to a Supabase database to fetch and manage AI prompts. The database contains:

- **ai_prompts table**: Stores prompt templates, model preferences, and usage statistics

## OpenRouter API Integration

The application uses OpenRouter API to generate AI content based on:

- Selected prompt template
- User-provided market intelligence
- Sales strategy information

## The Hundred API Integration

This feature requires a separate service called **The Hundred** which provides
additional data for report generation. Configure the following API endpoint and
keys in your environment variables:

- `VITE_THE_HUNDRED_API_URL` - Base URL of The Hundred API
- `VITE_THE_HUNDRED_API_KEY` - API key for authenticating requests
- Example endpoints include `/players` for roster data and `/stats` for
  performance statistics.

## Environment Variables

The application requires the following environment variables:

```
VITE_API_URL=http://localhost:3000/task
VITE_OPENROUTER_API_KEY=your-openrouter-api-key
VITE_THE_HUNDRED_API_URL=https://the-hundred.example.com/api
VITE_THE_HUNDRED_API_KEY=your-the-hundred-api-key
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with required environment variables
4. Start the development server: `npm run dev`

## Project Structure

- `src/components/`: React components
- `src/utils/`: Utility functions for API calls
- `src/App.jsx`: Main application component
- `src/main.jsx`: Application entry point

## Key Components

- **PromptSelector**: Interface for selecting AI prompts from Supabase
- **MarketIntelForm**: Form for inputting market intelligence data
- **SalesStrategiesForm**: Form for defining sales strategies
- **DoctorReportForm**: Form for generating the final doctor report
- **OutputPreview**: Preview panel showing generated content

## Workflow

1. User selects an AI prompt template
2. User fills out the Market Intelligence form
3. User completes the Sales Strategies form
4. User generates a Doctor-Ready Report using OpenRouter API
5. The report is displayed and can be copied or saved

## Deployment

The application is configured for deployment on Netlify with environment variables set in the Netlify dashboard.
