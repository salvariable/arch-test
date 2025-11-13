import { useQuery } from '@tanstack/react-query';
import { log } from '../utils/logger';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error : new Error(String(error));
    log(errorMessage, { context: 'fetchPosts', url: 'https://jsonplaceholder.typicode.com/posts' });
    throw errorMessage;
  }
};

export const usePosts = () => {
  return useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

