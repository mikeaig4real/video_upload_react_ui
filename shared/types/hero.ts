export type HeroStateType = {
  words: {
    text: string;
    className?: string;
  }[];
  heading: string;
  buttons: {
    text: string;
    to: string;
    className?: string;
  }[];
};
