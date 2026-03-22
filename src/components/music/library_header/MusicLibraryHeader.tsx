import { alpha, lighten } from '@mantine/core';
import styled from 'styled-components';

interface MusicLibraryHeaderProps {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  description?: string;
  search?: React.ReactNode;
  filtersControl?: React.ReactNode;
  sortControl?: React.ReactNode;
  layoutToggle?: React.ReactNode;
  statusNotice?: React.ReactNode;
  summary?: React.ReactNode;
  playlistsAction?: React.ReactNode;
}

const MusicLibraryHeader = ({
  className,
  style,
  title = 'Library controls',
  description = 'Shape the current page before you browse the queue.',
  search,
  filtersControl,
  sortControl,
  layoutToggle,
  statusNotice,
  summary,
  playlistsAction
}: MusicLibraryHeaderProps) => {
  return (
    <HeaderShell className={className} style={style}>
      <HeaderTop>
        <HeaderCopy>
          <Eyebrow>Music library</Eyebrow>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </HeaderCopy>
        {playlistsAction ? <ActionRail>{playlistsAction}</ActionRail> : null}
      </HeaderTop>

      {(search || sortControl || layoutToggle) && (
        <ControlRail>
          {search ? <ControlCard $wide>{search}</ControlCard> : null}
          {sortControl ? <ControlCard>{sortControl}</ControlCard> : null}
          {layoutToggle ? <ControlCard>{layoutToggle}</ControlCard> : null}
        </ControlRail>
      )}

      {filtersControl ? <FiltersRail>{filtersControl}</FiltersRail> : null}

      {statusNotice ? <StatusRail>{statusNotice}</StatusRail> : null}
      {summary ? <SummaryRail>{summary}</SummaryRail> : null}
    </HeaderShell>
  );
};

const HeaderShell = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 0.95rem 1rem;
  border-radius: 1.15rem;
  border: 1px solid ${alpha('var(--mantine-color-green-9)', 0.15)};
  background: linear-gradient(
    180deg,
    ${alpha('#000', 0.16)} 0%,
    ${alpha('#000', 0.32)} 100%
  );
  box-shadow:
    0 16px 32px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 ${alpha('#fff', 0.04)};
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.85rem;

  @media screen and (max-width: 720px) {
    flex-direction: column;
  }
`;

const HeaderCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
`;

const Eyebrow = styled.div`
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${lighten('var(--mantine-color-green-8)', 0.18)};
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
`;

const Description = styled.div`
  max-width: 48rem;
  color: rgba(255, 255, 255, 0.66);
  font-size: 0.82rem;
  line-height: 1.45;
`;

const ActionRail = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
`;

const ControlRail = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(11.5rem, 14rem) auto;
  gap: 0.65rem;
  align-items: stretch;

  @media screen and (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr) minmax(11.5rem, 14rem);
  }

  @media screen and (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const ControlCard = styled.div<{ $wide?: boolean }>`
  min-width: 0;
  display: flex;
  align-items: stretch;
  width: ${({ $wide }) => ($wide ? '100%' : 'auto')};
`;

const SummaryRail = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
`;

const StatusRail = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const FiltersRail = styled.div`
  display: flex;
  min-width: 0;
`;

export default MusicLibraryHeader;
