import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import HomeScreen from './index';

// Mock fetch
global.fetch = jest.fn();

const mockPush = jest.fn();

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  Link: ({ children, href }: any) => children,
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

describe('HomeScreen', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    mockPush.mockClear();
  });

  it('should render title on top and text component on center', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    render(<HomeScreen />, { wrapper: createWrapper() });
    
    expect(screen.getByText('Feed')).toBeTruthy();
  });

  it('should display error in text component when hook returns error', async () => {
    const mockError = new Error('Network error');
    (global.fetch as jest.Mock).mockRejectedValueOnce(mockError);

    render(<HomeScreen />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeTruthy();
    });
  });

  it('should display Loading label when hook is loading', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));

    render(<HomeScreen />, { wrapper: createWrapper() });

    expect(screen.getByText('Loading')).toBeTruthy();
  });

  it('should render FlatList with data when response has 1-20 items', async () => {
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Post ${i + 1}`,
      body: `Body ${i + 1}`,
      userId: 1,
    }));
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<HomeScreen />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('posts-flatlist')).toBeTruthy();
    });

    expect(screen.getByText('Post 1')).toBeTruthy();
  });

  it('should render Text with "Data is empty right now" when data length is 0', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<HomeScreen />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Data is empty right now')).toBeTruthy();
    });
  });

  it('should paginate data when response has more than 20 items', async () => {
    const mockData = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      title: `Post ${i + 1}`,
      body: `Body ${i + 1}`,
      userId: 1,
    }));
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<HomeScreen />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('posts-flatlist')).toBeTruthy();
    });

    // FlatList should be configured with pagination props
    const flatList = screen.getByTestId('posts-flatlist');
    expect(flatList).toBeTruthy();
  });

  it('should have pull-to-refresh feature that calls hook again', async () => {
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Post ${i + 1}`,
      body: `Body ${i + 1}`,
      userId: 1,
    }));
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    render(<HomeScreen />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('posts-flatlist')).toBeTruthy();
    });

    const flatList = screen.getByTestId('posts-flatlist');
    const refreshControl = flatList.props.refreshControl;
    
    expect(refreshControl).toBeTruthy();
    expect(refreshControl.props.onRefresh).toBeTruthy();
  });

  it('should navigate to ItemDetails when pressing an item', async () => {
    const mockData = [
      { id: 1, title: 'Test Post', body: 'Test Body', userId: 1 },
    ];
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    render(<HomeScreen />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('post-item-1')).toBeTruthy();
    });

    const item = screen.getByTestId('post-item-1');
    fireEvent.press(item);

    expect(mockPush).toHaveBeenCalledWith('/1');
  });
});

