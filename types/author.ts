export interface AuthorDetails {
    key: string;
    name: string;
    bio?: string | { value: string };
    birth_date?: string;
    death_date?: string;
    photos?: number[];
    links?: Array<{
      title: string;
      url: string;
      type?: { key: string };
    }>;
    alternate_names?: string[];
    personal_name?: string;
    wikipedia?: string;
  }