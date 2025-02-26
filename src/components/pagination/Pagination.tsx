import { Select, alpha, darken, lighten } from '@mantine/core';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';

import './Pagination.css';
import useMusicContext from '../../providers/useMusicContext';
import { useMemo } from 'react';
import { Size } from '../../hooks/useMediaQuery';

interface PaginationContainerProps {
  pageCount: number;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  totalItemsCount: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  clearSelected: () => void | undefined;
}
const PaginationContainer = ({
  pageCount,
  setPageSize,
  pageSize,
  totalItemsCount,
  page = 1,
  setPage,
  clearSelected
}: PaginationContainerProps) => {
  const { screenSize } = useMusicContext();
  const pageRange = useMemo(() => {
    switch (screenSize) {
      case Size.XS:
        return { page: 1, margin: 1 };
      case Size.SM:
        return { page: 1, margin: 1 };
      case Size.MD:
        return { page: 1, margin: 1 };
      case Size.LG:
        return { page: 2, margin: 1 };
      case Size.XL:
        return { page: 3, margin: 2 };
      default:
        return { page: 1, margin: 1 };
    }
  }, [screenSize]);
  const ShowPageInformation = () => {
    const endItem: number =
      page * pageSize + pageSize > totalItemsCount
        ? totalItemsCount
        : page * pageSize + pageSize;
    const startItem = totalItemsCount !== 0 ? page * pageSize + 1 : 0;
    return (
      <div className="data-info">
        <strong className="highlight">{startItem} - </strong>
        <strong className="highlight">{endItem}</strong> of{' '}
        <strong>{totalItemsCount?.toString()}</strong>
      </div>
    );
  };

  return (
    <ReactPaginateContainer>
      <ShowPageInformation />
      <ReactPaginate
        className="pagination"
        breakLabel="..."
        nextLabel=">"
        onPageChange={({ selected }) => {
          setPage && setPage(selected);
        }}
        pageRangeDisplayed={pageRange.page}
        marginPagesDisplayed={pageRange.margin}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        forcePage={page || 0}
      />
      <PageSizeOptions
        pageSize={pageSize}
        setPageSize={setPageSize}
        setPage={setPage}
        clearSelected={clearSelected}
      />
    </ReactPaginateContainer>
  );
};

interface PageSizeProps {
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  clearSelected: () => void | undefined;
}
const PageSizeOptions = ({
  pageSize,
  setPageSize,
  setPage,
  clearSelected
}: PageSizeProps) => {
  const sizeOptions = [10, 20, 50, 100, 200];
  return (
    <div className="data-grid-page-size">
      <SelectStyled
        value={pageSize.toString()}
        onChange={(e) => {
          setPageSize(e ? parseInt(e) : 0);
          setPage && setPage(0); // testing for pagination bug
          clearSelected && clearSelected();
        }}
        data={sizeOptions.map((s) => s.toString())}
        checkIconPosition="right"
        color="white"
        width="150px"
      />
    </div>
  );
};

const SelectStyled = styled(Select)`
  background-color: transparent;
  .mantine-Select-input {
    background: var(--shade-1);
    border-color: ${alpha('var(--mantine-color-green-6)', 0.5)};
    color: ${lighten('var(--mantine-color-green-5)', 0.1)};
    &::before,
    &::after {
      border-color: rgba(255, 255, 255, 0.2);
    }
    &:hover {
      color: ${lighten('var(--mantine-color-green-5)', 0.3)};
      background: ${darken('var(--mantine-color-green-3)', 0.83)};
      border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
    }
    &:focus {
      color: ${lighten('var(--mantine-color-green-5)', 0.3)};
      background: ${darken('var(--mantine-color-green-3)', 0.83)};
      border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
    }
  }
`;

const ReactPaginateContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: 'info pagination size';
  grid-gap: 1rem;
  padding: 0.8rem 1.4rem;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;
  .mantine-Popover-dropdown {
    /* background: rgba(255, 255, 255, 0.1); */

    background: var(--shade-2);
    color: rgba(255, 255, 255, 0.88);
    border-color: rgba(255, 255, 255, 0.2);
    &::before,
    &::after {
      border-color: rgba(255, 255, 255, 0.2);
    }
    &:hover {
      color: ${lighten('var(--mantine-color-green-5)', 0.3)};
      background: ${darken('var(--mantine-color-green-3)', 0.83)};
      border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
    }
    &:focus {
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
  .data-info {
    grid-area: info;
    color: rgba(255, 255, 255, 0.88);
    font-weight: 500;
    .highlight {
      color: ${alpha('var(--mantine-color-green-6)', 0.88)};
    }
  }

  .pagination {
    grid-area: pagination;
    margin-bottom: 0 !important;
    margin-inline: auto;
    display: inline-flex;
    align-items: center;
    li {
      &.active {
        a {
          background: var(--shade-2);
          border-color: ${alpha('var(--mantine-color-green-6)', 0.5)};
          color: ${lighten('var(--mantine-color-green-5)', 0.1)};
        }
      }
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        @media screen and (max-width: 768px) {
          width: 35px;
          height: 35px;
          margin-inline: 0.1rem;
        }
        width: 35px;
        height: 35px;
        margin-inline: 0.2rem;
        border-radius: 50%;
        color: rgba(255, 255, 255, 0.88);
        font-weight: 500;
        border: 1px solid rgba(255, 255, 255, 0.3);
        &:hover {
          color: ${lighten('var(--mantine-color-green-5)', 0.3)};
          background: ${darken('var(--mantine-color-green-3)', 0.83)};
          border-color: ${alpha('var(--mantine-color-green-6)', 0.88)};
        }
      }
      margin-top: 0;
      list-style: none;
    }
  }

  .data-grid-page-size {
    /* grid-area: size; */
    color: rgba(255, 255, 255, 0.88);
    display: flex;
    white-space: nowrap;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
    & > .mantine-InputWrapper-root {
      width: 150px;
    }
  }
  @media screen and (max-width: 1023px) {
    grid-template-columns: auto auto;
    grid-template-areas:
      'pagination pagination'
      'info size';
  }
`;

export default PaginationContainer;
