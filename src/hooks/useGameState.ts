import { useReducer } from "react";
import { GameState, GameStateAttributes } from "../models/GameState";

type Action = (state: GameState) => GameStateAttributes;

function reducer(): (state: GameState, action: Action) => GameState {
  return (state: GameState, action: Action) => {
    const newState = {
      ...state.dataValues,
      ...action(state),
    };

    return GameState.build({ ...newState });
  };
}

export function useGameState(
  initialState: GameState
): [GameState, (action: Action) => void] {
  const [state, dispatch] = useReducer(reducer(), initialState);

  const updateState = (action: Action) => {
    dispatch(action);
  };

  return [state, updateState];
}
