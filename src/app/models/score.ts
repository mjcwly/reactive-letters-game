export interface ScoreModel {
  scoreItems: ScoreItem[];
}

export interface ScoreItem {
  wordLength: number;
  wordCount: number;
}
