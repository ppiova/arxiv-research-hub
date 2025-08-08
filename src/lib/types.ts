export interface ArxivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  published: string;
  categories: string[];
  links: {
    abs: string;
    pdf: string;
  };
}

export interface PapersResponse {
  papers: ArxivPaper[];
  totalResults: number;
}

export interface APIError {
  message: string;
  status?: number;
}

export type TopicKey = 'llm-nlp' | 'computer-vision' | 'multimodal' | 'robotics-rl' | 'ir-rag' | 'speech-audio' | 'safety-evals' | 'ml-systems';

export interface QueryParams {
  topic?: TopicKey;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const TOPICS: Record<TopicKey, { label: string; category: string }> = {
  'llm-nlp': {
    label: 'LLMs & NLP',
    category: 'cs.CL'
  },
  'computer-vision': {
    label: 'Computer Vision',
    category: 'cs.CV'
  },
  'multimodal': {
    label: 'Multimodal',
    category: 'cs.MM'
  },
  'robotics-rl': {
    label: 'Robotics & RL',
    category: 'cs.RO'
  },
  'ir-rag': {
    label: 'IR/RAG',
    category: 'cs.IR'
  },
  'speech-audio': {
    label: 'Speech/Audio',
    category: 'eess.AS'
  },
  'safety-evals': {
    label: 'Safety/Evals',
    category: 'cs.AI'
  },
  'ml-systems': {
    label: 'ML Systems',
    category: 'cs.DC'
  }
};