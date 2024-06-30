import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

const MUSIC_QUERY = gql`
  query getMusic($pageSize: Int, $pageNumber: Int, $searchText: String) {
    music(
      pageNumber: $pageNumber
      pageSize: $pageSize
      searchText: $searchText
    ) {
      songs {
        id
        path
        lastUpdate
        title
        artist
        album
        genre
        release_year
      }
      totalItemsCount
    }
  }
`;

interface UseMusicInterface {
  skip: boolean;
  pageSize: number;
  pageNumber: number;
  searchText: string | undefined;
}

export default function useMusic({
  skip,
  pageSize,
  pageNumber,
  searchText
}: UseMusicInterface) {
  const { data, error, loading } = useQuery(MUSIC_QUERY, {
    variables: { pageSize, pageNumber: pageNumber + 1, searchText },
    skip
  });
  const errors = useMemo(() => {
    return Array.isArray(error) ? error : [error];
  }, [error]);

  const totalPageCount: number = useMemo(() => {
    return Math.ceil(data?.music?.totalItemsCount / pageSize);
  }, [data?.music?.totalItemsCount]);
  console.log('data', data);
  return {
    totalItemsCount: data?.music?.totalItemsCount,
    totalPageCount,
    data: data?.music?.songs,
    loading,
    errors
  };
}
