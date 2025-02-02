import { TRequest, TStructure } from '../../models/models';

export interface IReferenceNavProps {
  fetchMarkdown: <T>(request: TRequest) => Promise<T>;
  codified: TStructure;
  setMarkdownContent: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface IReferenceData {
  data: {
    content?: string;
    hash?: string;
    path?: string;
    reference_id?: number;
  };
}
