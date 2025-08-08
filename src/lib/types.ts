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

export const TOPICS: Record<TopicKey, { label: string; query: string }> = {
  'llm-nlp': {
    label: 'LLMs & NLP',
    query: 'cat:cs.CL OR cat:cs.AI OR cat:stat.ML'
  },
  'computer-vision': {
    label: 'Computer Vision',
    query: 'cat:cs.CV OR cat:cs.GR'
  },
  'multimodal': {
    label: 'Multimodal',
    query: 'cat:cs.MM OR cat:cs.CV OR cat:cs.CL'
  },
  'robotics-rl': {
    label: 'Robotics & RL',
    query: 'cat:cs.RO OR cat:cs.LG OR cat:stat.ML'
  },
  'ir-rag': {
    label: 'IR/RAG',
    query: 'cat:cs.IR OR cat:cs.DB OR cat:cs.AI'
  },
  'speech-audio': {
    label: 'Speech/Audio',
    query: 'cat:cs.SD OR cat:eess.AS OR cat:cs.CL'
  },
  'safety-evals': {
    label: 'Safety/Evals',
    query: 'cat:cs.AI OR cat:cs.CY OR cat:cs.LG'
  },
  'ml-systems': {
    label: 'ML Systems',
    query: 'cat:cs.DC OR cat:cs.LG OR cat:cs.PF'
  }
};