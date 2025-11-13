import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { usePosts, Post } from '../hooks/usePosts';

const ITEMS_PER_PAGE = 20;

const HomeScreen = () => {
  const router = useRouter();
  const { data, isLoading, error, refetch, isRefetching } = usePosts();

  const paginatedData = useMemo(() => {
    if (!data) return [];
    return data.slice(0, ITEMS_PER_PAGE);
  }, [data]);

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const renderItem = useCallback(({ item }: { item: Post }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() => router.push(`/${item.id}`)}
        testID={`post-item-${item.id}`}
      >
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemBody} numberOfLines={2}>
          {item.body}
        </Text>
      </TouchableOpacity>
    );
  }, [router]);

  const keyExtractor = useCallback((item: Post) => item.id.toString(), []);

  if (isLoading && !data) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Feed</Text>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" />
          <Text style={styles.centerText}>Loading</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Feed</Text>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>
            Error: {error.message || 'An error occurred'}
          </Text>
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Feed</Text>
        <View style={styles.centerContent}>
          <Text style={styles.centerText}>Data is empty right now</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>
      <FlatList
        testID="posts-flatlist"
        data={paginatedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        getItemLayout={(_, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#ff0000',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  itemBody: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;

