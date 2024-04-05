import { useMemo } from "react";
import { KeyboardState } from "../components/Keyboard";
import { GameState } from "../models/GameState";
import { checkLetters } from "../words";

export function useKeyboardState(
  gameState: Readonly<GameState>
): KeyboardState {
  return useMemo(() => {
    let backspace = true;
    let enter = true;
    let letters = true;

    if (gameState.isFinished) {
      backspace = false;
      enter = false;
      letters = false;
    } else if (gameState.currentGuess.length == 0) {
      backspace = false;
      enter = false;
    } else if (gameState.currentGuess.length >= 5) {
      letters = false;
    } else {
      enter = false;
    }

    return {
      backspace,
      enter,
      letters,
      letterStatus: checkLetters(
        gameState.guessRows.slice(0, gameState.guessed),
        gameState.solution
      ),
    } as KeyboardState;
  }, [gameState]);
}
