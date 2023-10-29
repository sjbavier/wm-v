import { Spin } from 'antd';
import { FC, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { ReferenceNav } from '../../components/reference/ReferenceNav';
import useClient from '../../hooks/useClient';
import { useReferenceStructure } from '../../hooks/useReferenceStructure';
import { VERBOSITY } from '../../lib/constants';
import { TStructure } from '../../models/models';

const Reference: FC = () => {
  const { data, loading } = useReferenceStructure();
  const {
    fetchMe: fetchMarkdown,
    loading: loadingMarkdown
    // error: errorMarkdown
  } = useClient(VERBOSITY.SILENT);

  const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  const [codified, setcodified] = useState<TStructure>({
    name: '',
    path: '',
    type: 'directory'
  });

  useEffect(() => {
    let mounted = true;
    const convertCodified = async () => {
      const dataObj = await JSON.parse(data?.structure || '');
      if (mounted) {
        setcodified(dataObj);
      }
    };
    convertCodified();
    return () => {
      mounted = false;
    };
  }, [data?.structure]);

  return (
    <div className="flex ">
      {loading && (
        <div className="h-screen flex items-center justify-center flex-1">
          <Spin />
        </div>
      )}
      {data && codified && (
        <ReferenceNav
          fetchMarkdown={fetchMarkdown}
          codified={codified}
          setMarkdownContent={setMarkdownContent}
        />
      )}
      {loadingMarkdown && (
        <div className="h-screen flex items-center justify-center flex-1">
          <Spin />
        </div>
      )}
      {markdownContent && !loadingMarkdown && (
        <div className="h-screen overflow-auto p-8 flex-1">
          <ReactMarkdown
            children={markdownContent}
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, style, ...props }) {
                const match = /language-(\w+)/.exec(className || '');

                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, '')}
                    style={oneDark}
                    language={match[1] === 'sh' ? 'bash' : match[1]}
                    PreTag="div"
                    wrapLongLines
                    {...props}
                  />
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
            }}
          ></ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Reference;
