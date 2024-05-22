import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

const MUSIC_QUERY = gql`
  query getMusic($pageSize: Int, $pageNumber: Int) {
    music(pageNumber: $pageNumber, pageSize: $pageSize) {
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
}

export default function useMusic({
  skip,
  pageSize,
  pageNumber
}: UseMusicInterface) {
  const { data, error, loading } = useQuery(MUSIC_QUERY, {
    variables: { pageSize, pageNumber: pageNumber + 1 },
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
