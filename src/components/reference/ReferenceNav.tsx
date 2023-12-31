import { useEffect, useState } from 'react';
import { IReferenceData, IReferenceNavProps } from './models';
import Render from '../render/Render';

export const ReferenceNav = ({
  fetchMarkdown,
  codified,
  setMarkdownContent
}: IReferenceNavProps) => {
  const [nav, setNav] = useState<FileNode[]>([{ name: '', path: '' }]);

  useEffect(() => {
    let mounted = true;

    const structure = (codified: TStructure): FileNode[] => {
      const walkNodes = (children: TStructure[]) => {
        const nodeTree: FileNode[] = [];

        children
          .filter((x) => x.type !== 'hidden')
          .forEach((node) => {
            const node_new = createNode(node);
            if (node_new) {
              nodeTree.push(node_new);
            }
          });

        return nodeTree;
      };

      const createNode = (node: TStructure): FileNode => {
        let fnode: FileNode = { name: '', path: '' };
        if (node.type === 'directory' && Array.isArray(node.children)) {
          fnode.name = node.name;
          fnode.path = node.path;
          fnode.children = (() =>
            walkNodes(node.children) as any as FileNode[])();
        } else {
          fnode.name = node.name;
          fnode.path = node.path;
        }

        return fnode;
      };

      if (codified?.children) {
        return walkNodes(codified.children) as any as FileNode[];
      }

      return [{ name: '', path: '' }];
    };

    if (mounted) {
      const navStructure = structure(codified);
      setNav(navStructure);
    }

    return () => {
      mounted = false;
    };
  }, [codified]);

  // const onSelect = async (info) => {
  //   const pathname = info.node.key.toString();
  //   const request: TRequest = {
  //     method: 'GET',
  //     path: `/api/reference/path?name=${pathname}`
  //   };
  //   const extension = pathname.match(/\.[0-9a-z]+$/i);
  //   if (extension) {
  //     const data: IReferenceData = await fetchMarkdown(request);
  //     data.data.content
  //       ? setMarkdownContent(data?.data?.content)
  //       : setMarkdownContent(null);
  //   }
  // };
  console.log('nav codified', codified);
  console.log('nav data', nav);

  return (
    <div className="overflow-y-auto min-w-fit h-screen pt-8 pb-8">
      {nav.map((item) => (
        <FileNode item={item} key={crypto.randomUUID()} />
      ))}
    </div>
  );
};

const FileNode = ({
  item: { type, name, path, children }
}: {
  item: FileNode;
}) => {
  return (
    <div className="relative">
      <div className="inline-flex">
        {children && '>'}
        <div>{name}</div>
      </div>
      <Render if={Array.isArray(children)}>
        {children?.map((item) => (
          <FileNode item={item} key={crypto.randomUUID()} />
        ))}
      </Render>
    </div>
  );
};
