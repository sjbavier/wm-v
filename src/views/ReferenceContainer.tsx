import { FC, ForwardedRef, forwardRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Prism as SyntaxHighlighter
  // SyntaxHighlighterProps
} from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Loader } from '@mantine/core';
import { ReferenceNav } from '../components/reference/ReferenceNav';
import { useReferenceStructure } from '../hooks/useReferenceStructure';
import useClient, { safeJson } from '../hooks/useClient';
import { VERBOSITY } from '../constants/constants';

// interface CustomSyntaxHighlighter extends SyntaxHighlighterProps {
//     forwardRef?: ForwardedRef<HTMLElement>
// }

const ReferenceContainer: FC = () => {
  const {
    data,
    loading,
    error,
    fetchMarkdown,
    loadingMarkdown,
    markdownContent,
    setMarkdownContent,
    codified
  } = useReferenceStructure();
  // const {
  //   fetchMe: fetchMarkdown,
  //   loading: loadingMarkdown
  //   // error: errorMarkdown
  // } = useClient(VERBOSITY.SILENT);

  // const [markdownContent, setMarkdownContent] = useState<string | null>(null);
  // const [codified, setcodified] = useState<TStructure>({
  //   name: '',
  //   path: '',
  //   type: 'directory'
  // });

  // useEffect(() => {
  //   let mounted = true;
  //   const convertCodified = async () => {
  //     // const dataObj = await JSON.parse(data?.structure || '');
  //     const dataObj = await safeJson(data?.structure || '');
  //     if (mounted) {
  //       setcodified(dataObj);
  //     }
  //   };
  //   convertCodified();
  //   return () => {
  //     mounted = false;
  //   };
  // }, [data?.structure]);

  return (
    <div className="flex ">
      {loading && (
        <div className="h-screen flex items-center justify-center flex-1">
          <Loader color="gray" type="bars" />
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
          <Loader color="gray" type="bars" />
        </div>
      )}
      {markdownContent && !loadingMarkdown && (
        <div className="h-screen overflow-auto p-8 flex-1">
          <ReactMarkdown
            children={markdownContent}
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, style, ...props }) {
                const match = /language-(\w+)/.exec(className || '');

                return match ? (
                  <SyntaxHighlighter
                    key={crypto.randomUUID()}
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

// const CustomSyntaxHighlighter = forwardRef<HTMLElement, CustomSyntaxHighlighter> ({children, forwardRef, ...props}, ref) =>{
//     return (<SyntaxHighlighter ref={forwardRef || ref} children={String(children).replace(/\n$/, '')} style={oneDark} {...props} />)
// }
export default ReferenceContainer;
