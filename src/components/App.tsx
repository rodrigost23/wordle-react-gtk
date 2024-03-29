import React, { useCallback, useMemo, useReducer, useState } from "react";
import {
  AboutDialog,
  ApplicationWindow,
  AspectFrame,
  Box,
  Gdk,
  Gtk,
  HeaderBar,
  Label,
  MenuButton,
  useActionGroup,
  useApplication,
  useMenu,
  useStylesheet,
} from "react-native-gtk4";
import { GameState, GameStateAttributes } from "../models/GameState";
import { availableWords } from "../words";
import GuessGrid from "./GuessGrid";
import Keyboard from "./Keyboard";

interface Props {
  readonly initialState: GameState;
}

export default function App({ initialState }: Props) {
  useStylesheet("src/data/styles.css");
  const { quit, application } = useApplication();
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const solution = initialState.solution;

  const menu = useMenu(
    [
      {
        label: "About",
        action: "menu.about",
      },
    ],
    []
  );
  const actions = useActionGroup(
    {
      about: () => {
        setShowAboutDialog(true);
      },
    },
    [menu]
  );

  const [state, setState] = useReducer(
    (
      state: GameState,
      action: GameState | ((state: GameState) => GameStateAttributes)
    ) => {
      if (action instanceof GameState) {
        action = (action) => action;
      }

      const newState = {
        ...state.dataValues,
        ...action(state),
      };

      return GameState.build({ ...newState });
    },
    initialState
  );

  const message: string = useMemo(() => {
    if (state.error !== null) {
      return state.error;
    }

    if (state.isSolved) {
      return "Congratulations!";
    }

    if (state.isFinished) {
      return `The correct word was "${solution}"`;
    }

    return "";
  }, [state.isFinished, state.error]);

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

        let guessRows = [...state.guessRows];
        let guessed = state.guessed;
        let error: string | null = null;

        if (key === "Enter") {
          if (state.currentGuess.length < 5) return state;

          if (availableWords.includes(state.currentGuess)) {
            guessed += 1;
          } else {
            error = `"${state.currentGuess}" is not in the words list!`;
          }
        } else if (key === "Backspace") {
          if (!state.currentGuess.length) return state;
          guessRows[state.guessed] = guessRows[state.guessed].slice(0, -1);
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

  function onClose() {
    GameState.upsert(state.dataValues);
    return quit();
  }

  return (
    <ApplicationWindow
      title="Wordle"
      onCloseRequest={onClose}
      defaultWidth={600}
      defaultHeight={720}
      resizable={false}
      titlebar={
        <HeaderBar.Container title={<Label label="Wordle" />}>
          <HeaderBar.Section position="end">
            <MenuButton
              direction={Gtk.ArrowType.NONE}
              menuModel={menu}
              actionGroup={actions}
              actionPrefix="menu"
            ></MenuButton>
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
      {showAboutDialog ? (
        <AboutDialog
          programName="Wordle GTK"
          version={process.env.npm_package_version}
          copyright="Rodrigo Tavares, 2024."
          authors={["Rodrigo Tavares <me@rodrigotavar.es>"]}
          onCloseRequest={() => {
            setShowAboutDialog(false);
            return false;
          }}
        />
      ) : null}
    </ApplicationWindow>
  );
}
