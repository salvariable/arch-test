# Arch Test - Expo React Native Project

A React Native Expo application that displays posts from JSONPlaceholder API with a feed screen and detail screen, built following TDD principles.

## Features

- **Feed Screen**: Fetches and displays posts from JSONPlaceholder API
- **Pull-to-Refresh**: Refresh posts by pulling down on the feed
- **Detail Screen**: View full post details by tapping on a list item
- **Data Layer**: Uses React Query for data fetching, caching, and state management
- **Error Handling**: Comprehensive error handling with logging
- **Performance Optimizations**: Optimized FlatList with memoization
- **Pagination**: Automatically paginates posts (shows first 20 items)

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd arch-test
```

2. Install dependencies:
```bash
npm install
```

## Running the App

### Start the development server:
```bash
npm start
```

This will start the Expo development server. You can then:
- Press `i` to open in iOS simulator
- Press `a` to open in Android emulator
- Scan the QR code with Expo Go app on your device

### Run on specific platform:
```bash
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

## Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Project Structure

```
arch-test/
├── app/
│   ├── _layout.tsx      # Root layout with QueryClientProvider
│   ├── index.tsx        # Home/Feed screen
│   ├── [id].tsx         # Post detail screen
│   ├── index.test.tsx   # Home screen tests
│   └── [id].test.tsx    # Detail screen tests
├── hooks/
│   ├── usePosts.tsx                    # Custom hook for fetching posts
│   ├── usePosts.test.tsx               # Hook tests
│   └── usePosts.optimization.test.tsx  # Hook optimization tests
├── utils/
│   └── logger.ts         # Error logging utility
└── package.json
```

## Technology Stack

- **Expo**: React Native framework
- **Expo Router**: File-based routing
- **React Query (TanStack Query)**: Data fetching and caching
- **Jest**: Testing framework
- **React Native Testing Library**: Component testing utilities

## API

The app fetches data from:
- Posts: `https://jsonplaceholder.typicode.com/posts`
- Individual Post: `https://jsonplaceholder.typicode.com/posts/{id}`

## Development Notes

- Built following Test-Driven Development (TDD) approach
- All features are covered by tests
- React Query handles caching, retry logic, and loading states
- FlatList is optimized with performance props
- Components use React.memo and useCallback for optimization

