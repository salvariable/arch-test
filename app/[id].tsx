import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Post, usePosts } from '../hooks/usePosts';
import { log } from '../utils/logger';

const fetchPost = async (id: string): Promise<Post> => {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error : new Error(String(error));
    log(errorMessage, { context: 'fetchPost', id });
    throw errorMessage;
  }
};

const ItemDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: allPosts } = usePosts();

  // Try to get from cache first, then fetch if needed
  const { data: post, isLoading, error } = useQuery<Post, Error>({
    queryKey: ['post', id],
    queryFn: () => fetchPost(id!),
    enabled: !!id,
    initialData: allPosts?.find((p) => p.id.toString() === id),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error: {error?.message || 'Post not found'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container} testID="item-details-screen">
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.body}>{post.body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
  },
});

export default ItemDetailsScreen;

