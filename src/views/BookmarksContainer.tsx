import { FC, useState, useEffect, useCallback, useMemo } from 'react';
import { Col, Row, Table, Tag } from 'antd';

import { useNavigate, useParams } from 'react-router-dom';
import useClient from '../../hooks/useClient';
import { VERBOSITY } from '../../lib/constants';
import { IBookmarks, ICategory, TRequest } from '../../models/models';
import styled from 'styled-components';
import Search from '../../components/search/search';
import { IDataProps } from '../../components/search/models';

const Bookmarks: FC = () => {
  interface IResult {
    num_pages?: number;
    bookmarks_total?: number;
    data?: IBookmarks[] | [];
  }

  const [bookmarks, setBookmarks] = useState<IBookmarks[] | []>([]);
  const { fetchMe, loading: isLoading } = useClient(VERBOSITY.SILENT);
  const [totalBookmarks, setTotalBookmarks] = useState<number | undefined>(
    undefined
  );

  const { page = '1', pageSize = '10' } = useParams() as {
    page: string;
    pageSize: string;
  };
  const navigate = useNavigate();

  const columns = [
    {
      title: 'id',
      dataIndex: 'bookmark_id',
      key: 'bookmark_id'
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <p className="break-words">{text}</p>
    },
    {
      title: 'Link',
      dataIndex: 'link',
      key: 'link',
      render: (link: string) => (
        <a className="break-all" href={link} target="_blank" rel="noreferrer">
          {link}
        </a>
      )
    },
    {
      title: 'Categories',
      key: 'categories_collection',
      dataIndex: 'categories_collection',
      render: (categories_collection: ICategory[]) => (
        <>
          {categories_collection.map((category) => {
            return (
              <Tag color="blue" className="mt-1" key={category.category_id}>
                {category.name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    }
  ];
  const getBookmarks = useCallback(
    async (request: TRequest) => {
      const data: IResult = await fetchMe(request);
      setBookmarks(data.data ? data.data : []);
      setTotalBookmarks(data?.bookmarks_total);
    },
    [fetchMe]
  );

  const getParameters = useMemo(() => {
    const request: TRequest = {
      method: 'GET',
      path: `/api/bookmarks/page/${page}/page_size/${pageSize}`
    };
    return request;
  }, [page, pageSize]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      getBookmarks(getParameters);
    }
    return () => {
      mounted = false;
    };
  }, [getBookmarks, getParameters]);

  const searchProps: IDataProps<IBookmarks> = {
    data: bookmarks,
    setData: setBookmarks,
    getParameters,
    getData: getBookmarks,
    searchUrl: `/api/bookmarks/search/`
  };

  return (
    <div className="p-8">
      <h1>bookmarks</h1>
      <Row>
        <Col span={16}>
          <Search {...searchProps} />
        </Col>
      </Row>

      <NeuTable
        className="bookmarks"
        loading={isLoading}
        columns={columns}
        dataSource={bookmarks}
        scroll={{ x: true }}
        pagination={{
          pageSize: pageSize ? parseInt(pageSize) : undefined,
          total: totalBookmarks,
          onChange: (page, pageSize) => {
            navigate(`/bookmarks/page/${page}/page_size/${pageSize}`);
          }
        }}
      />
    </div>
  );
};

const NeuTable = styled(Table)`
  .ant-table {
    border-radius: 7px;
    background: transparent;
    box-shadow: inset 0px 3px 5px hsla(0, 0%, 0%, 0.2),
      inset 0px -5px 5px hsla(0, 0%, 0%, 0.3);
  }

  .ant-table-thead > tr > th {
    background: none;
  }
  .ant-pagination {
    margin-top: 2rem;
    padding: 1rem;
    border-radius: 7px;
    background: transparent;
    box-shadow: inset 0px 3px 5px hsla(0, 0%, 0%, 0.2),
      inset 0px -5px 5px hsla(0, 0%, 0%, 0.3);
  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: hsl(228deg 23% 31% / 38%);
  }
`;

export default Bookmarks;
