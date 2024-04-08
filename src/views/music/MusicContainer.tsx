import styled from 'styled-components';

const MusicContainer = () => {
  const musicSrc =
    'http://localhost:8080/music?file=/Creed%20-%20Human%20Clay%20-%20Beautiful';
  return (
    <AudioContainer>
      <audio src={musicSrc} controls>
        {' '}
        doesn't work
      </audio>
    </AudioContainer>
  );
};

const AudioContainer = styled.div``;
export default MusicContainer;
