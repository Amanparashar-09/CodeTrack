/**
 * Question Bank - Testing Guide
 * 
 * This guide covers manual and automated testing for the Question Bank feature
 */

/**
 * Manual Testing Checklist
 */

// 1. Navigation & Routing
// ✓ Click "Question Bank" link in navbar
// ✓ Page loads at /question-bank route
// ✓ Layout with header and component is rendered
// ✓ Back button/navigation works correctly

// 2. Platform Selection
// ✓ "All" is selected by default
// ✓ Questions from all 5 platforms load automatically
// ✓ Click on specific platform loads its questions
// ✓ Platform buttons show active state
// ✓ Questions count changes when platform changes

// 3. Difficulty Filter
// ✓ "All" is default selection
// ✓ Filter by "Easy" shows only easy questions
// ✓ Filter by "Medium" shows only medium questions
// ✓ Filter by "Hard" shows only hard questions
// ✓ Difficulty badges display correctly

// 4. Search Functionality
// ✓ Typing in search box filters questions in real-time
// ✓ Search matches both title and description
// ✓ Case-insensitive search works
// ✓ Clearing search shows all questions again
// ✓ Search respects current platform and difficulty filters

// 5. Tag Filtering
// ✓ Tags are extracted from questions
// ✓ Tag filter dropdown shows all unique tags
// ✓ Selecting a tag filters questions
// ✓ "All Tags" selection shows all questions
// ✓ Tag filter works with other filters

// 6. Sorting
// ✓ Default sort is "Newest"
// ✓ "Newest First" shows recent questions
// ✓ "Oldest First" shows older questions
// ✓ "A - Z" sorts alphabetically by title
// ✓ Sorting works with all filter combinations

// 7. Loading & Error States
// ✓ Skeleton loaders appear during loading
// ✓ Error message appears with retry button if fetch fails
// ✓ Clicking retry refetches questions
// ✓ Empty state message shows when no questions found

// 8. Integration Tests
// ✓ AddProblemPage shows question browser above form
// ✓ QuestionBankPage shows full-width component
// ✓ Navbar link navigates correctly
// ✓ Sidebar link (if present) works

// 9. Responsive Design
// ✓ Component works on desktop (1920px)
// ✓ Component works on tablet (768px)
// ✓ Component works on mobile (375px)
// ✓ All buttons and filters are usable on mobile

// 10. Performance
// ✓ Page loads within reasonable time
// ✓ "All" platform aggregation completes within 5 seconds
// ✓ Filtering provides instant feedback
// ✓ No memory leaks or excessive re-renders

/**
 * Automated Testing Examples (Jest/React Testing Library)
 */

/*
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import BrowseQuestionsByPlatform from './BrowseQuestionsByPlatform'
import * as problemsApi from '../../api/problemsApi'

jest.mock('../../api/problemsApi')
jest.mock('react-hot-toast')

describe('BrowseQuestionsByPlatform', () => {
  beforeEach(() => {
    problemsApi.getByPlatform.mockClear()
  })

  test('renders with All platform selected by default', () => {
    render(
      <BrowserRouter>
        <BrowseQuestionsByPlatform />
      </BrowserRouter>
    )
    expect(screen.getByRole('button', { name: /All/i })).toHaveClass('active')
  })

  test('fetches questions on platform change', async () => {
    problemsApi.getByPlatform.mockResolvedValue({
      data: {
        questions: [{ _id: '1', title: 'Test', platform: 'LeetCode', tags: [] }]
      }
    })

    render(
      <BrowserRouter>
        <BrowseQuestionsByPlatform />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(problemsApi.getByPlatform).toHaveBeenCalled()
    })
  })

  test('filters questions by difficulty', async () => {
    const questions = [
      { _id: '1', title: 'Easy', difficulty: 'Easy', platform: 'LeetCode', tags: [] },
      { _id: '2', title: 'Hard', difficulty: 'Hard', platform: 'LeetCode', tags: [] }
    ]

    problemsApi.getByPlatform.mockResolvedValue({ data: { questions } })

    render(
      <BrowserRouter>
        <BrowseQuestionsByPlatform />
      </BrowserRouter>
    )

    const easyButton = screen.getByRole('button', { name: /Easy/i })
    fireEvent.click(easyButton)

    await waitFor(() => {
      expect(screen.getByText('Easy')).toBeInTheDocument()
      expect(screen.queryByText('Hard')).not.toBeInTheDocument()
    })
  })

  test('shows empty state when no questions found', async () => {
    problemsApi.getByPlatform.mockResolvedValue({ data: { questions: [] } })

    render(
      <BrowserRouter>
        <BrowseQuestionsByPlatform />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/No questions found/i)).toBeInTheDocument()
    })
  })
})
*/

/**
 * Edge Cases to Test
 */

// 1. Slow network - simulate with network throttling
// 2. Offline mode - questions should not load, error shown
// 3. Large dataset - performance test with 1000+ questions
// 4. Special characters in search - ensure safe filtering
// 5. User rapid clicking on platforms - prevent race conditions
// 6. Logout while viewing - redirect to login
// 7. Unauthorized access - show error
// 8. Invalid filter combinations - display appropriate message

/**
 * Browser DevTools Testing Tips
 */

// 1. Network Tab:
//    - Verify API calls are made with correct parameters
//    - Check response payloads are valid
//    - Ensure no duplicate requests
//
// 2. Performance Tab:
//    - Check rendering performance
//    - Look for unnecessary re-renders
//    - Monitor component lifecycle
//
// 3. Console:
//    - No errors or warnings
//    - Check network request logging
//
// 4. Accessibility Tab:
//    - Verify ARIA labels
//    - Check keyboard navigation
//    - Ensure color contrast is sufficient
