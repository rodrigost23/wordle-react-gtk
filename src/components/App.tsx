import React, { useCallback, useMemo, useReducer } from "react";

import {
  ApplicationWindow,
  AspectFrame,
  Box,
  Button,
  Gdk,
  Gtk,
  HeaderBar,
  Label,
  useApplication,
  useStylesheet,
} from "react-native-gtk4";
import { GameState, IGameState } from "../models/GameState";
import { availableWords, getTodayWord } from "../words";
import GuessGrid from "./GuessGrid";
import Keyboard from "./Keyboard";

export default function App() {
  useStylesheet("src/data/styles.css");
  const { quit, application } = useApplication();

  const solution = getTodayWord();

  const [state, setState] = useReducer(
    (state: GameState, action: (state: GameState) => IGameState) => {
      const newState = {
        ...state,
        ...action(state),
      };
      return new GameState({ ...newState });
    },
    new GameState({ solution })
  );

  const message: string = useMemo(() => {
    if (state.isFinished) {
      return "Finished";
    }

    return "";
  }, [state.isFinished]);

  const keyboardState = useMemo(() => {
    let backspace = true;
    let enter = true;
    let letters = true;

    if (state.isFinished) {
      backspace = false;
      enter = false;
      letters = false;
    } else if (state.currentGuess.length == 0) {
      backspace = false;
      enter = false;
    } else if (state.currentGuess.length >= 5) {
      letters = false;
    } else {
      enter = false;
    }

    return {
      backspace,
      enter,
      letters,
    };
  }, [state]);

  const keySpacing = 4;
  const margin = 16;

  const onKeyPress = useCallback(
    (key: string) => {
      setState((state: GameState) => {
        if (state.isFinished) return state;

        let updatedGuessRows = [...state.guessRows];
        let updatedGuessed = state.guessed;

        if (key === "Enter") {
          if (
            state.currentGuess.length < 5 ||
            // TODO: Add an "error" variable to the state:
            !availableWords.includes(state.currentGuess)
          )
            return state;
          updatedGuessed += 1;
        } else if (key === "Backspace") {
          if (!state.currentGuess.length) return state;
          updatedGuessRows[state.guessed] = updatedGuessRows[
            state.guessed
          ].slice(0, -1);
        } else if (/[a-zA-Z]/.test(key) && state.currentGuess.length < 5) {
          updatedGuessRows[state.guessed] ??= "";
          updatedGuessRows[state.guessed] += key.toLowerCase();
        }

        return {
          guessRows: updatedGuessRows,
          guessed: updatedGuessed,
        };
      });
    },
    [state.currentGuess]
  );

  application.connect("window-added", (window) => {
    const eventKey = new Gtk.EventControllerKey();
    eventKey.connect("key-released", (keyval) => {
      if (keyval === Gdk.KEY_Return) {
        onKeyPress("Enter");
      } else if (keyval === Gdk.KEY_BackSpace) {
        onKeyPress("Backspace");
      } else if (
        (keyval >= Gdk.KEY_a && keyval <= Gdk.KEY_z) ||
        (keyval >= Gdk.KEY_A && keyval <= Gdk.KEY_Z)
      ) {
        onKeyPress(String.fromCharCode(keyval));
      }
    });

    window.addController(eventKey);
  });

  return (
    <ApplicationWindow
      title="Wordle"
      onCloseRequest={quit}
      defaultWidth={600}
      defaultHeight={720}
      resizable={false}
      titlebar={
        <HeaderBar.Container title={<Label label="Wordle" />}>
          <HeaderBar.Section position="end">
            <Button></Button>
          </HeaderBar.Section>
        </HeaderBar.Container>
      }
    >
      <Box
        hexpand
        vexpand
        halign={Gtk.Align.FILL}
        valign={Gtk.Align.FILL}
        orientation={Gtk.Orientation.VERTICAL}
        spacing={4}
        marginTop={margin}
        marginEnd={margin}
        marginBottom={margin}
        marginStart={margin}
      >
        <AspectFrame
          hexpand
          vexpand
          halign={Gtk.Align.FILL}
          valign={Gtk.Align.FILL}
          marginBottom={24}
          ratio={5 / 6}
          obeyChild={false}
        >
          <Box hexpand vexpand halign={Gtk.Align.FILL} valign={Gtk.Align.FILL}>
            <GuessGrid
              spacing={keySpacing}
              state={state}
              correctWord={solution}
            />
          </Box>
        </AspectFrame>
        <Label label={message} />
        <Keyboard state={keyboardState} onKeyPress={onKeyPress} />
      </Box>
    </ApplicationWindow>
  );
}
