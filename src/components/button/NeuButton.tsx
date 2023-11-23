import styled from 'styled-components';

export const NeuButton = styled.div`
  color: #fff;
  font-size: 1.4em;
  padding: 0.4rem 0.8rem;
  border-radius: 0px;
  border: transparent;
  box-shadow: 6px 6px 7px hsla(0, 0%, 0%, 0.3);
  background: linear-gradient(
    -45deg,
    hsla(0, 0%, 0%, 0.1) 0%,
    hsla(0, 0%, 50%, 0.1) 100%
  );
  &:focus {
    background: linear-gradient(
      -45deg,
      hsla(0, 0%, 0%, 0.1) 0%,
      hsla(0, 0%, 50%, 0.1) 100%
    );
  }
`;
