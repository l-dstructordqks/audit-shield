export type Color = "GREEN" | "YELLOW" | "RED";
export type Action = string;

export interface Filters {
  colors: Color[];
  outdated: boolean;
  action: Action;
}