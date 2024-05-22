import { Input } from '@mantine/core';
import ReactPaginate from 'react-paginate';
import styled from 'styled-components';

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
        Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of{' '}
        <strong>{totalItemsCount.toString()}</strong>
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
      <label>Page Size </label>
      <Input
        type="select"
        value={pageSize}
        onChange={(e) => {
          setPageSize(parseInt(e.target.value));
          setPage && setPage(0); // testing for pagination bug
          clearSelected && clearSelected();
        }}
      >
        {sizeOptions.map((item) => {
          return (
            <option key={item} value={item}>
              {item}
            </option>
          );
        })}
      </Input>
    </div>
  );
};

const ReactPaginateContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas: 'info pagination size';
  grid-gap: 1rem;
  padding: 0.5rem 1rem;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  font-size: 0.875rem;

  .data-info {
    grid-area: info;
    color: rgb(127, 136, 153);
    font-weight: 500;
  }

  .pagination {
    grid-area: pagination;
    margin-bottom: 0 !important;
    margin-inline: auto;
    li {
      margin-inline: 0 !important;
    }
  }

  .data-grid-page-size {
    grid-area: size;
    display: flex;
    white-space: nowrap;
    align-items: center;
    gap: 0.5rem;
  }
  @media screen and (max-width: 1023px) {
    grid-template-columns: auto auto;
    grid-template-areas:
      'pagination pagination'
      'info size';
  }
`;

export default PaginationContainer;
