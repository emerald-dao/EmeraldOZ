export interface Page {
  name: string;
  url: string;
  component: any;
  options?: Page[]
}