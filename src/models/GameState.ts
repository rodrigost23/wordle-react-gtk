export interface IGameState {
  readonly guessRows: string[];
  readonly guessed: number;
  readonly error: string | null;
}

export class GameState implements IGameState {
  readonly solution: string;
  readonly guessRows: string[];
  readonly guessed: number;
  readonly error: string | null;

  constructor({
    solution,
    guessRows = [],
    guessed = 0,
    error = null,
  }: { solution: string } & Partial<IGameState>) {
    this.solution = solution;
    this.guessRows = guessRows;
    this.guessed = guessed;
    this.error = error;
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
