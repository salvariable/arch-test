import { render, screen, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ItemDetailsScreen from './[id]';

// Mock fetch
global.fetch = jest.fn();

// Mock expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({
    id: '1',
  }),
}));

// Mock usePosts hook
jest.mock('../hooks/usePosts', () => ({
  usePosts: jest.fn(() => ({
    data: [
      { id: 1, title: 'Test Post Title', body: 'Test Post Body', userId: 1 },
    ],
  })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('ItemDetailsScreen', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should render title and body in separate text components', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 1,
        title: 'Test Post Title',
        body: 'Test Post Body',
        userId: 1,
      }),
    });

    render(<ItemDetailsScreen />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('item-details-screen')).toBeTruthy();
    });

    expect(screen.getByText('Test Post Title')).toBeTruthy();
    expect(screen.getByText('Test Post Body')).toBeTruthy();
  });
});

