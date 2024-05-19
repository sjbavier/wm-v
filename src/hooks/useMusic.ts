import { gql, useQuery } from '@apollo/client';
import { useMemo } from 'react';

const MUSIC_QUERY = gql`
  query getMusic {
    music {
      id
      path
      lastUpdate
      title
      artist
      album
      genre
      release_year
    }
  }
`;

interface UseMusicInterface {
  skip: boolean;
}

export default function useMusic({ skip }: UseMusicInterface) {
  const { data, error, loading } = useQuery(MUSIC_QUERY, { skip });
  const errors = useMemo(() => {
    return Array.isArray(error) ? error : [error];
  }, [error]);
  console.log('data', data);
  return {
    data: data?.music,
    loading,
    errors
  };
}
