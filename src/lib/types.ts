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

export type SortMode = 'latest' | 'relevance';

export interface QueryParams {
  topic?: TopicKey;
  mode?: SortMode;
  search?: string;
  keywords?: string[];
  from?: string; // YYYYMMDD
  to?: string;   // YYYYMMDD
  page?: number;
  pageSize?: number;
}

export interface DateRange {
  label: string;
  days: number;
}

export const DATE_RANGES: DateRange[] = [
  { label: '7 días', days: 7 },
  { label: '14 días', days: 14 },
  { label: '30 días', days: 30 }
];

export const TOPICS: Record<TopicKey, { label: string; category: string; keywords: string[] }> = {
  'llm-nlp': {
    label: 'LLMs & NLP',
    category: 'cs.CL',
    keywords: ['LLM', 'large language model', 'transformer', 'reasoning', 'RAG']
  },
  'computer-vision': {
    label: 'Computer Vision',
    category: 'cs.CV',
    keywords: ['diffusion', 'detection', 'segmentation', 'vision-language']
  },
  'multimodal': {
    label: 'Multimodal',
    category: 'cs.MM',
    keywords: ['vision-language', 'VLM', 'multimodal']
  },
  'robotics-rl': {
    label: 'Robotics & RL',
    category: 'cs.RO',
    keywords: ['reinforcement learning', 'robotics', 'policy']
  },
  'ir-rag': {
    label: 'IR/RAG',
    category: 'cs.IR',
    keywords: ['retrieval', 'RAG', 'indexing', 'reranking']
  },
  'speech-audio': {
    label: 'Speech/Audio',
    category: 'eess.AS',
    keywords: ['speech', 'ASR', 'TTS', 'audio']
  },
  'safety-evals': {
    label: 'Safety/Evals',
    category: 'cs.AI',
    keywords: ['safety', 'alignment', 'evaluation', 'benchmark']
  },
  'ml-systems': {
    label: 'ML Systems',
    category: 'cs.DC',
    keywords: ['systems', 'scaling', 'inference', 'serving', 'quantization']
  }
};