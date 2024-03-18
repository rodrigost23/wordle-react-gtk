import React, { useCallback, useMemo, useReducer, useRef } from "react";

import {
  ApplicationWindow,
  AspectFrame,
  Box,
  Button,
  Gtk,
  HeaderBar,
  Label,
  useApplication,
  useStylesheet,
  Gdk,
} from "react-native-gtk4";
import GuessGrid from "./GuessGrid";
import Keyboard from "./Keyboard";

interface GameState {
  guessRows: string[];
  guessed: number;
}

export default function App() {
  useStylesheet("data/styles.css");
  const { quit, application } = useApplication();

  const [state, setState] = useReducer(
    (
      state: GameState,
      action: (state: GameState) => Partial<GameState>
    ) => ({
      ...state,
      ...action(state),
    }),
    {
      guessRows: [],
      guessed: 0,
    }
  );

  const currentGuess = useMemo(
    () => state.guessRows[state.guessed] ?? "",
    [state.guessRows, state.guessed]
  );

  const keyboardState = useMemo(() => {
    let backspace = true;
    let enter = true;
    let letters = true;

    if (state.guessed >= 6) {
      backspace = false;
      enter = false;
      letters = false;
    } else if (currentGuess.length == 0) {
      backspace = false;
      enter = false;
    } else if (currentGuess.length >= 5) {
      letters = false;
    } else {
      enter = false;
    }

    return {
      backspace,
      enter,
      letters,
    };
  }, [state.guessed, currentGuess]);

  const width = 380;
  const keySpacing = 4;
  const margin = 16;

  const onKeyPress = useCallback(
    (key: string) => {
      setState((state: GameState) => {
        if (state.guessed >= 6) return state;

        let updatedGuessRows = [...state.guessRows];
        let updatedGuessed = state.guessed;

        if (key === "Enter") {
          if (currentGuess.length < 5) return state;
          updatedGuessed += 1;
        } else if (key === "Backspace") {
          if (!currentGuess.length) return state;
          updatedGuessRows[state.guessed] = updatedGuessRows[
            state.guessed
          ].slice(0, -1);
        } else if (/[a-zA-Z]/.test(key) && currentGuess.length < 5) {
          updatedGuessRows[state.guessed] ??= "";
          updatedGuessRows[state.guessed] += key.toLowerCase();
        }

        return {
          guessRows: updatedGuessRows,
          guessed: updatedGuessed,
        };
      });
    },
    [currentGuess]
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
      defaultWidth={width}
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
            <GuessGrid spacing={keySpacing} guessRows={state.guessRows} />
          </Box>
        </AspectFrame>
        <Keyboard state={keyboardState} onKeyPress={onKeyPress} />
      </Box>
    </ApplicationWindow>
  );
}
