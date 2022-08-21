export interface ScoreModel {
  scoreItems: ScoreItem[];
  longestWordLength: number;
}

export interface ScoreItem {
  wordLength: number;
  wordCount: number;
}
