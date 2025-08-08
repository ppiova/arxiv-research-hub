/**
 * @fileoverview Type definitions for arXiv Research Hub
 * 
 * This module contains all TypeScript type definitions used throughout
 * the application, including data structures for papers, API responses,
 * and configuration constants.
 * 
 * @author arXiv Research Hub Team
 * @version 1.0.0
 */

/**
 * Represents a single research paper from arXiv
 * @interface ArxivPaper
 */
export interface ArxivPaper {
  /** Unique arXiv identifier for the paper */
  id: string;
  /** Paper title */
  title: string;
  /** Paper abstract/summary */
  summary: string;
  /** List of paper authors */
  authors: string[];
  /** Publication date in ISO format */
  published: string;
  /** arXiv category codes (e.g., 'cs.CL', 'cs.AI') */
  categories: string[];
  /** Links to different paper formats */
  links: {
    /** Link to abstract page */
    abs: string;
    /** Link to PDF download */
    pdf: string;
    /** Link to HTML view */
    html: string;
  };
}

/**
 * API response structure for paper queries
 * @interface PapersResponse
 */
export interface PapersResponse {
  /** Array of paper objects */
  papers: ArxivPaper[];
  /** Total number of results available */
  totalResults: number;
}

/**
 * Error structure for API failures
 * @interface APIError
 */
export interface APIError {
  /** Human-readable error message */
  message: string;
  /** HTTP status code if applicable */
  status?: number;
}

/**
 * Supported research topic identifiers
 * @typedef {string} TopicKey
 */
export type TopicKey = 'llm-nlp' | 'computer-vision' | 'multimodal' | 'robotics-rl' | 'ir-rag' | 'speech-audio' | 'safety-evals' | 'ml-systems';

/**
 * Query parameters for paper search
 * @interface QueryParams
 */
export interface QueryParams {
  /** Research topic filter */
  topic?: TopicKey;
  /** Search query string */
  search?: string;
  /** Page number (0-based) */
  page?: number;
  /** Results per page */
  pageSize?: number;
}

/**
 * Mapping of topic keys to their display labels and arXiv categories
 * 
 * This configuration defines the 8 supported research domains and their
 * corresponding arXiv category codes used for API queries.
 * 
 * @constant TOPICS
 */
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