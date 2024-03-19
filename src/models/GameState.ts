export interface IGameState {
  guessRows: string[];
  guessed: number;
}

export class GameState implements IGameState {
  readonly guessRows: string[];
  readonly guessed: number;

  constructor({ guessRows = [], guessed = 0 }: Partial<IGameState> = {}) {
    this.guessRows = guessRows;
    this.guessed = guessed;
  }

  get currentGuess() {
    return this.guessRows[this.guessed] ?? "";
  }
}
