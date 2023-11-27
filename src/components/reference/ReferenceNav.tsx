import { DownOutlined } from '@ant-design/icons';
import Tree, { DataNode, TreeProps } from 'antd/lib/tree';
import { useEffect, useState } from 'react';
import { TRequest, TStructure } from '../../models/models';
import { IReferenceData, IReferenceNavProps } from './models';

export const ReferenceNav = ({
  fetchMarkdown,
  codified,
  setMarkdownContent
}: IReferenceNavProps) => {
  const [nav, setNav] = useState<DataNode[]>([{ key: '' }]);

  useEffect(() => {
    let mounted = true;

    const structure = (codified: TStructure): DataNode[] => {
      const walkNodes = (_children: TStructure[]) => {
        const nodeTree: DataNode[] = [];

        _children
          .filter((x) => x.type !== 'hidden')
          .forEach((node) => {
            const _node = createNode(node);
            if (_node) {
              nodeTree.push(_node);
            }
          });

        return nodeTree;
      };

      const createNode = (node: TStructure): DataNode => {
        let _node: DataNode = { key: '' };
        if (node.type === 'directory' && Array.isArray(node.children)) {
          _node.title = node.name;
          _node.key = node.path;
          _node.children = (() =>
            walkNodes(node.children) as any as DataNode[])();
        } else {
          _node.title = node.name;
          _node.key = node.path;
        }

        return _node;
      };

      if (codified?.children) {
        return walkNodes(codified.children) as any as DataNode[];
      }

      return [{ key: '' }];
    };

    if (mounted) {
      const navStructure = structure(codified);
      setNav(navStructure);
    }

    return () => {
      mounted = false;
    };
  }, [codified]);

  const onSelect: TreeProps['onSelect'] = async (selectedKeys, info) => {
    const pathname = info.node.key.toString();
    const request: TRequest = {
      method: 'GET',
      path: `/api/reference/path?name=${pathname}`
    };
    const extension = pathname.match(/\.[0-9a-z]+$/i);
    if (extension) {
      const data: IReferenceData = await fetchMarkdown(request);
      data.data.content
        ? setMarkdownContent(data?.data?.content)
        : setMarkdownContent(null);
    }
  };

  return (
    <div className="overflow-y-auto min-w-fit h-screen pt-8 pb-8">
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        onSelect={onSelect}
        treeData={nav}
      />
    </div>
  );
};
