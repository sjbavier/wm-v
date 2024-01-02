import { useEffect, useState } from 'react';
import { IReferenceData, IReferenceNavProps } from './models';
import Render from '../render/Render';
import { useToggle } from '../../hooks/useToggle';
import {
  IconChevronRight,
  IconCode,
  IconFolderCode,
  IconMarkdown
} from '@tabler/icons-react';

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

  const onSelect = async (path) => {
    const request: TRequest = {
      method: 'GET',
      path: `/api/reference/path?name=${path}`
    };
    const data: IReferenceData = await fetchMarkdown(request);
    data.data.content
      ? setMarkdownContent(data?.data?.content)
      : setMarkdownContent(null);
  };
  console.log('nav codified', codified);
  console.log('nav data', nav);

  return (
    <div className="overflow-y-auto min-w-fit h-screen py-8 pl-10 text-zinc-300">
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
  const [isOpen, toggleIsOpen] = useToggle(false);
  const extension = path.match(/\.([^.]+)$/)?.[1]; // Extracts the extension
  return (
    <div className="relative">
      <div
        className="inline-flex"
        onClick={async () => {
          if (!!children) {
            toggleIsOpen();
            return;
          }
          onSelect(path);
        }}
      >
        <Render if={!!children}>
          <IconChevronRight />
          <IconFolderCode className="mr-1" />
        </Render>
        <Render if={!!extension && extension === 'md'}>
          <IconMarkdown className="mr-1" />
        </Render>
        <Render if={!!extension && extension !== 'md'}>
          <IconCode className="mr-1" />
        </Render>
        <div>{name}</div>
      </div>
      <Render if={Array.isArray(children) && isOpen}>
        <div className="mx-6">
          {children?.map((item) => (
            <FileNode item={item} key={crypto.randomUUID()} />
          ))}
        </div>
      </Render>
    </div>
  );
};
