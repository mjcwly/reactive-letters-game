export interface ChosenLetter {
  letter: string;
  isTypedLetter: boolean;
}

export const Blank: ChosenLetter = {
  letter: '',
  isTypedLetter: false,
};

export const QuestionMark: ChosenLetter = {
  letter: '?',
  isTypedLetter: false,
};
