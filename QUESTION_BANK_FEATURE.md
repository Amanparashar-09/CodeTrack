# Question Bank Feature Documentation

## Overview

The **Question Bank** feature enables users to explore and filter coding problems collected from multiple platforms, without the need to add their own questions first. It offers a centralized and organized view of available problems, making it easier for users to learn, practice, and improve their coding skills.


## Features

### 1. Multi-Platform Support
- Browse questions from 5 platforms: LeetCode, HackerRank, Codeforces, GeeksforGeeks, and Other
- Aggregate questions from all platforms with a single "All" filter
- Each platform is color-coded for easy visual identification

### 2. Advanced Filtering
- **Platform Filter**: Select specific platform or view all platforms
- **Difficulty Filter**: Filter by Easy, Medium, Hard, or All
- **Tag Filter**: Filter questions by relevant tags
- **Search**: Full-text search across question titles and descriptions

### 3. Sorting Options
- **Newest**: Recently added questions first
- **Oldest**: Oldest questions first
- **A-Z**: Alphabetical order

### 4. User Experience
- Loading skeletons while fetching questions
- Error handling with retry capability
- Empty state messaging when no questions found
- Staggered animations for better visual feedback
- External links to original platform questions
- Dark theme styling matched to application design

## Architecture

### Backend
- **Controller**: `problemController.js` - `getQuestionsByPlatform` function
- **Route**: `GET /api/problems/browse?platform=X&difficulty=Y&search=Z&tags=X&sortBy=newest`
- **Authentication**: Protected with JWT token requirement

### Frontend
- **Component**: `BrowseQuestionsByPlatform.jsx` - Main browsing interface
- **Page**: `QuestionBankPage.jsx` - Dedicated page wrapper
- **API**: `problemsApi.js` - `getByPlatform` method
- **Integration**: Available in QuestionBankPage and AddProblemPage

## Data Flow
1. User selects platform and applies filters
2. Component calls `fetchQuestions(platform)`
3. For "All" platform: Sequential API calls to each platform endpoint
4. Questions are aggregated and tags are extracted
5. UI renders filtered and sorted questions with animations

## Styling
- Dark theme with gray-950 background
- Platform-specific color coding
- Difficulty badges with color classes
- Responsive grid layout
- Hover effects and smooth transitions

## Performance Considerations

* Questions are loaded lazily whenever the selected platform changes
* Tags are extracted during data fetching instead of on every re-render
* The "All" platform aggregates data using sequential API calls to prevent race conditions
* The default platform is set to "All" to ensure immediate data visibility

