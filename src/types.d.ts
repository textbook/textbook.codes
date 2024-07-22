export interface Fact {
  details?: string[];
  title: string;
  url: URL;
}

export interface Options {
  json: boolean;
}

export interface Summary {
  name: string;
  description?: string;
  facts: Fact[];
}
