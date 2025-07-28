export interface Book {
    key: string;
    title: string;
    author_name?: string[];
    first_publish_year?: number;
    cover_i?: number;
    isbn?: string[];
    subject?: string[];
    publisher?: string[];
    language?: string[];
    number_of_pages_median?: number;
  }
  
  export interface BookDetails extends Book {
    description?: string | { value: string };
    subjects?: string[];
    subject_places?: string[];
    covers?: number[];
    links?: Array<{
      title: string;
      url: string;
    }>;
  }
  
  export interface SearchResponse {
    docs: Book[];
    numFound: number;
    start: number;
    numFoundExact?: boolean;
  }