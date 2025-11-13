# Architecture & Implementation Report

## Data Layer Choice: React Query (TanStack Query)

**Why React Query?**
- Built-in caching mechanism reduces unnecessary network requests
- Automatic retry logic with exponential backoff
- Excellent TypeScript support
- Handles loading, error, and success states out of the box
- Stale-while-revalidate pattern provides optimal UX
- Easy to test with QueryClientProvider
- Better suited for server state management than Zustand (which is better for client state)

## Retry/Backoff & Cache Choices

**Retry Strategy:**
- Configured with 3 retry attempts
- Exponential backoff: `Math.min(1000 * 2 ** attemptIndex, 30000)`
  - Attempt 1: 1s delay
  - Attempt 2: 2s delay
  - Attempt 3: 4s delay
  - Max delay capped at 30s
- Uses React Query's default retry mechanism

**Cache Policy:**
- `staleTime: 5 minutes` - Data considered fresh for 5 minutes, no refetch during this period
- `gcTime: 10 minutes` (formerly cacheTime) - Unused data kept in cache for 10 minutes
- Prevents unnecessary refetches when navigating between screens
- Detail screen uses `initialData` from posts cache to avoid extra network call

## Performance Choices

**FlatList Optimizations:**
- `initialNumToRender={10}` - Only render first 10 items initially
- `maxToRenderPerBatch={10}` - Render 10 items per batch during scroll
- `windowSize={10}` - Render items within 10 viewport heights
- `removeClippedSubviews={true}` - Remove off-screen views from native view hierarchy
- `getItemLayout` - Pre-calculated item heights for better scroll performance

**Memoization:**
- `useMemo` for paginated data calculation (only recalculates when data changes)
- `useCallback` for `renderItem`, `keyExtractor`, and `onRefresh` to prevent unnecessary re-renders
- React Query's built-in caching prevents redundant API calls

## Error Handling

- All API calls wrapped in try-catch blocks
- Errors logged via `log(error, context)` utility function
- Network errors and HTTP errors handled separately
- Error states displayed in UI with user-friendly messages
- React Query automatically retries failed requests

## Testing Approach

- **TDD Methodology**: Tests written before implementation
- All "I expect" requirements covered by test cases
- Mocked fetch API for reliable testing
- QueryClientProvider wrapper for testing React Query hooks
- Component tests verify UI states (loading, error, success, empty)

## If AI Was Used

**Tool:** Cursor AI Assistant

**Prompts:**
- Initial project setup and structure
- Test implementation for TDD requirements
- React Query configuration and optimization
- FlatList performance tuning

**What Was Kept:**
- All test cases and TDD structure
- React Query as data layer choice
- Performance optimizations (FlatList props, memoization)
- Error handling approach
- Project structure and file organization

**What Was Changed:**
- Adjusted some test mocks for better compatibility
- Refined FlatList performance props based on React Native best practices
- Enhanced error messages for better UX

