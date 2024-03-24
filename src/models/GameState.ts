export interface IGameState {
  guessRows: string[];
  guessed: number;
}

export class GameState implements IGameState {
  readonly solution: string;
  readonly guessRows: string[];
  readonly guessed: number;

  constructor({
    solution,
    guessRows = [],
    guessed = 0,
  }: { solution: string } & Partial<IGameState>) {
    this.solution = solution;
    this.guessRows = guessRows;
    this.guessed = guessed;
  }

  get currentGuess() {
    return this.guessRows[this.guessed] ?? "";
  }

  get isSolved() {
    return (
      this.guessed > 0 && this.guessRows.at(this.guessed - 1) === this.solution
    );
  }

  get isFinished() {
    return this.isSolved || this.guessed >= 6;
  }
}
