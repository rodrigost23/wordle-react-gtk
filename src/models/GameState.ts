import { Column, DataType, Model, Table } from "sequelize-typescript";

export interface GameStateAttributes {
  readonly date: Date;
  readonly guessRows: string[];
  readonly guessed: number;
  readonly error: string | null;
  readonly solution: string;
}

@Table({
  timestamps: false,
})
export class GameState
  extends Model<GameStateAttributes, Partial<GameStateAttributes>>
  implements GameStateAttributes
{
  @Column
  date!: Date;

  @Column({ type: DataType.JSON, defaultValue: [] })
  guessRows!: string[];

  @Column({ defaultValue: 0 })
  guessed!: number;

  @Column({ type: DataType.STRING, defaultValue: null })
  error!: string | null;

  @Column
  solution!: string;

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
