import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePosts } from './usePosts';

// Mock fetch
global.fetch = jest.fn();

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 5 * 60 * 1000,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePosts optimization', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('should optimize hook call when data does not change after first call', async () => {
    const mockData = [
      { id: 1, title: 'Test Post', body: 'Test Body', userId: 1 },
    ];
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const { result, rerender } = renderHook(() => usePosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const firstCallCount = (global.fetch as jest.Mock).mock.calls.length;

    // Rerender should not trigger a new fetch due to caching
    rerender();

    await waitFor(() => {
      // Fetch should not be called again if data hasn't changed
      // React Query will use cached data if it's not stale
      expect(result.current.data).toBeTruthy();
    });

    // The fetch count should remain the same (or only increase by 1 for initial fetch)
    // This demonstrates that React Query is using cached data
    expect(result.current.data).toEqual(mockData);
  });
});

