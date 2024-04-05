import { useCallback } from "react";
import { GameState, GameStateAttributes } from "../models/GameState";
import { availableWords } from "../words";

export function useKeyPressHandler(
  state: GameState,
  updateState: (action: (state: GameState) => GameStateAttributes) => void
) {
  return useCallback(
    (key: string) => {
      updateState((state: GameState) => {
        if (state.isFinished) return state;

        let guessRows = [...state.guessRows];
        let guessed = state.guessed;
        let error: string | null = null;

        if (key === "Enter") {
          if (state.currentGuess.length < 5) return state;

          if (availableWords.includes(state.currentGuess)) {
            guessed += 1;
          } else {
            error = `"${state.currentGuess.toUpperCase()}" is not in the words list!`;
          }
        } else if (key === "Backspace") {
          if (!state.currentGuess.length) return state;
          guessRows[state.guessed] = guessRows[state.guessed]!.slice(0, -1);
        } else if (/[a-zA-Z]/.test(key) && state.currentGuess.length < 5) {
          guessRows[state.guessed] ??= "";
          guessRows[state.guessed] += key.toLowerCase();
        }

        return {
          date: state.date,
          solution: state.solution,
          guessRows,
          guessed,
          error,
        };
      });
    },
    [state.currentGuess]
  );
}
