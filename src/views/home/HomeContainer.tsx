import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { alpha, lighten } from '@mantine/core';
import { IconBooks, IconLogin2, IconPlayerPlayFilled } from '@tabler/icons-react';

const HomeContainer = () => {
  const navigate = useNavigate();

  return (
    <PageShell>
      <HeroSection>
        <Eyebrow>Webmane media hub</Eyebrow>
        <HeroTitle>Music first, with room to grow.</HeroTitle>
        <HeroCopy>
          Browse the library, drive playback with the upgraded player, and jump
          into the other active parts of the app from one place.
        </HeroCopy>
        <PrimaryActions>
          <PrimaryButton type="button" onClick={() => navigate('/media')}>
            <IconPlayerPlayFilled stroke="1" />
            Open music library
          </PrimaryButton>
          <SecondaryButton type="button" onClick={() => navigate('/login')}>
            <IconLogin2 stroke="1" />
            Login
          </SecondaryButton>
        </PrimaryActions>
      </HeroSection>

      <CardGrid>
        <FeatureCard>
          <CardEyebrow>Primary surface</CardEyebrow>
          <CardTitle>Music player</CardTitle>
          <CardCopy>
            Search, queue, shuffle, repeat, playlists, and the cover-art driven
            visual system all live here.
          </CardCopy>
          <CardMeta>Streaming over REST, metadata over GraphQL</CardMeta>
          <CardButton type="button" onClick={() => navigate('/media')}>
            Go to music
          </CardButton>
        </FeatureCard>

        <FeatureCard>
          <CardEyebrow>Protected area</CardEyebrow>
          <CardTitle>Reference library</CardTitle>
          <CardCopy>
            Structured reference content is available behind auth. Jump there
            directly if you already have access.
          </CardCopy>
          <CardMeta>Requires authentication</CardMeta>
          <CardButton type="button" onClick={() => navigate('/reference')}>
            <IconBooks stroke="1" />
            Open reference
          </CardButton>
        </FeatureCard>

        <FeatureCard>
          <CardEyebrow>Current focus</CardEyebrow>
          <CardTitle>What improved recently</CardTitle>
          <FeatureList>
            <li>custom transport, queue, shuffle, and repeat</li>
            <li>persistent search, stronger loading, and empty states</li>
            <li>richer metadata and more visible playlist controls</li>
          </FeatureList>
          <CardMeta>Phase 1 and phase 2 improvements are now reflected in the UI</CardMeta>
        </FeatureCard>
      </CardGrid>
    </PageShell>
  );
};

const PageShell = styled.div`
  min-height: 100vh;
  padding: 5rem 1.75rem 3rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background:
    radial-gradient(circle at 20% 20%, rgba(37, 186, 107, 0.12), transparent 35%),
    radial-gradient(circle at 80% 10%, rgba(67, 119, 239, 0.14), transparent 32%),
    linear-gradient(180deg, rgba(6, 10, 13, 0.92), rgba(7, 11, 15, 0.98));
  color: rgba(255, 255, 255, 0.94);

  @media screen and (max-width: 960px) {
    padding: 4.5rem 1rem 2rem 4rem;
  }

  @media screen and (max-width: 640px) {
    padding: 4.5rem 0.85rem 1.5rem 3.6rem;
  }
`;

const HeroSection = styled.section`
  max-width: 56rem;
  padding: 1.4rem 1.5rem;
  border-radius: 1.4rem;
  border: 1px solid ${alpha('var(--mantine-color-green-9)', 0.16)};
  background: linear-gradient(
    180deg,
    ${alpha('#000', 0.2)} 0%,
    ${alpha('#000', 0.42)} 100%
  );
  box-shadow:
    0 20px 50px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 ${alpha('#fff', 0.05)};
`;

const Eyebrow = styled.div`
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${lighten('var(--mantine-color-green-8)', 0.18)};
`;

const HeroTitle = styled.h1`
  margin: 0.4rem 0 0;
  font-size: clamp(2.2rem, 4vw, 4rem);
  line-height: 0.95;
  max-width: 11ch;
`;

const HeroCopy = styled.p`
  max-width: 42rem;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 1rem;
  line-height: 1.6;
`;

const PrimaryActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1.35rem;
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  border-radius: 999px;
  padding: 0.8rem 1rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    transform 150ms ease,
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const PrimaryButton = styled(ActionButton)`
  background: linear-gradient(
    180deg,
    ${alpha('var(--mantine-color-green-5)', 0.95)} 0%,
    ${alpha('var(--mantine-color-green-7)', 0.95)} 100%
  );
  color: #06110b;
  font-weight: 700;
`;

const SecondaryButton = styled(ActionButton)`
  background: rgba(255, 255, 255, 0.04);
  border-color: ${alpha('var(--mantine-color-green-8)', 0.16)};
  color: rgba(255, 255, 255, 0.88);
`;

const CardGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media screen and (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media screen and (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.article`
  min-height: 16rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.15rem;
  border-radius: 1.2rem;
  border: 1px solid ${alpha('var(--mantine-color-green-9)', 0.14)};
  background: linear-gradient(
    180deg,
    ${alpha('#000', 0.14)} 0%,
    ${alpha('#000', 0.3)} 100%
  );
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 ${alpha('#fff', 0.04)};
`;

const CardEyebrow = styled.div`
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.52);
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.35rem;
`;

const CardCopy = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.55;
`;

const CardMeta = styled.div`
  margin-top: auto;
  font-size: 0.76rem;
  color: ${lighten('var(--mantine-color-green-8)', 0.14)};
`;

const CardButton = styled(ActionButton)`
  width: fit-content;
  background: rgba(255, 255, 255, 0.04);
  border-color: ${alpha('var(--mantine-color-green-8)', 0.18)};
  color: rgba(255, 255, 255, 0.9);
  padding-inline: 0.9rem;
`;

const FeatureList = styled.ul`
  margin: 0;
  padding-left: 1rem;
  list-style: disc;
  color: rgba(255, 255, 255, 0.76);
  line-height: 1.5;
`;

export default HomeContainer;
