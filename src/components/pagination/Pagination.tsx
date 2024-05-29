import { Input, Select } from '@mantine/core';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';

import './Pagination.css';

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
  const ShowPageInformation = () => {
    const endItem: number =
      page * pageSize + pageSize > totalItemsCount
        ? totalItemsCount
        : page * pageSize + pageSize;
    const startItem = totalItemsCount !== 0 ? page * pageSize + 1 : 0;
    return (
      <div className="data-info">
        <strong>{startItem}</strong> - <strong>{endItem}</strong> of{' '}
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
        pageRangeDisplayed={4}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
        marginPagesDisplayed={1}
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
      />
    </div>
  );
};

const SelectStyled = styled(Select)`
  background-color: transparent;
  .mantine-Select-input {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.88);
    border-color: rgba(255, 255, 255, 0.2);
    &::before,
    &::after {
      border-color: rgba(255, 255, 255, 0.2);
    }
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    &:focus {
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
`;

const ReactPaginateContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'info pagination size';
  grid-gap: 1rem;
  padding: 1.4rem 1.4rem;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;

  .mantine-Popover-dropdown {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.88);
    border-color: rgba(255, 255, 255, 0.2);
    &::before,
    &::after {
      border-color: rgba(255, 255, 255, 0.2);
    }
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    &:focus {
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  }
  .data-info {
    grid-area: info;
    color: rgba(255, 255, 255, 0.88);
    font-weight: 500;
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
          background: rgba(255, 255, 255, 0.2);
        }
      }
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 50px;
        height: 50px;
        margin-inline: 0.4rem;
        border-radius: 50%;
        color: rgba(255, 255, 255, 0.88);
        font-weight: 700;
        border: 1px solid rgba(255, 255, 255, 0.3);
        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      }
      margin-top: 0;
      list-style: none;
    }
  }

  .data-grid-page-size {
    grid-area: size;
    color: rgba(255, 255, 255, 0.88);
    display: flex;
    white-space: nowrap;
    align-items: center;
    gap: 0.5rem;
    margin-left: auto;
  }
  @media screen and (max-width: 1023px) {
    grid-template-columns: auto auto;
    grid-template-areas:
      'pagination pagination'
      'info size';
  }
`;

export default PaginationContainer;
