## Description

This pull request introduces a comprehensive **Question Bank** feature that allows users to browse and filter coding problems from multiple platforms without needing to add their own problems beforehand.
It also lays the foundation for future enhancements such as personalized recommendations and progress tracking based on user activity.  
This ensures the platform can scale further while continuously improving the learning experience.

### Features Added

#### Backend Changes

* **New API Endpoint**: `GET /api/problems/browse` with support for filtering by platform, difficulty, tags, and search queries
* **Question Filtering**: Backend-level filtering with regex support for full-text search
* **Platform Support**: LeetCode, HackerRank, Codeforces, GeeksforGeeks, and Other
* **Email Validation**: Improved email sender utility with proper validation for SMTP configuration

#### Frontend Changes

* **BrowseQuestionsByPlatform Component**: A complete question browsing interface with support for filtering and sorting
* **QuestionBankPage**: A dedicated page designed specifically for accessing the Question Bank
* **Multi-Platform Browsing**: Allows users to view questions from all platforms or filter by a selected platform
* **Advanced Filtering**: Supports filtering by difficulty, tags, and text-based search
* **Sorting Options**: Enables sorting by newest, oldest, or alphabetical order
* **API Integration**: Introduced the `getByPlatform` method in `problemsApi`


#### User Interface

* Platform-specific color coding for better visual distinction
* Difficulty badges (Easy, Medium, Hard)
* Real-time filtering and search functionality
* Loading skeletons for improved user experience
* Error handling with retry support
* Empty state messaging
* Fully responsive design across devices
* External links to original problem sources

### Documentation Added

* **API_INTEGRATION_GUIDE.md**: Detailed API integration guide with endpoints, request examples, and error handling strategies
* **QUESTION_BANK_FEATURE.md**: Overview of the feature, architecture, and performance considerations
* **TESTING_GUIDE.md**: Comprehensive manual and automated testing guidelines
* **questionBankConfig.js**: Configuration constants for platforms and difficulty levels
* **questionFilters.js**: Utility functions for filtering and sorting questions

### Technical Details

* Aggregates questions from multiple platforms using sequential API calls
* Client-side filtering enables instant user feedback
* Tags are extracted dynamically from fetched questions
* Graceful error handling with fallback to partial results
* Performance optimizations for handling larger datasets
* JWT authentication required for all API endpoints

### Navigation Integration

* Added a **"Question Bank"** link to the navbar with a book icon
* Integrated with the existing AddProblemPage for seamless problem selection
* New route added: `/question-bank`

### Files Modified

* **Backend**: problemController.js, problemRoutes.js, emailSender.js
* **Frontend**: App.jsx, Navbar.jsx, AddProblemPage.jsx, problemsApi.js
* **New Components**: BrowseQuestionsByPlatform.jsx, QuestionBankPage.jsx
* **Documentation**: API_INTEGRATION_GUIDE.md, QUESTION_BANK_FEATURE.md, TESTING_GUIDE.md
* **Utilities**: questionBankConfig.js, questionFilters.js

### Testing

Comprehensive testing guidelines include:

* Manual testing checklist for all features
* Automated testing examples using Jest and React Testing Library
* Coverage of edge cases and performance testing scenarios
* Browser DevTools testing tips

### Testing Evidence

* Include screenshots or terminal output for manual verification wherever applicable
* Provide links to relevant test files or mention the commands used to validate the changes


### Performance Considerations

* Sequential API calls help prevent race conditions
* Client-side filtering performs efficiently for typical dataset sizes
* Tag extraction is optimized to run once during data fetch
* Future scalability and optimization paths are documented
