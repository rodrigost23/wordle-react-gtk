import React, { useMemo, useState } from "react";
import {
  ApplicationWindow,
  AspectFrame,
  Box,
  Button,
  Frame,
  Grid,
  Gtk,
  HeaderBar,
  Label,
  useApplication,
  useStylesheet,
} from "react-native-gtk4";
import Keyboard from "./Keyboard";
import GuessGrid from "./GuessGrid";

export default function App() {
  useStylesheet("data/styles.css");
  const { quit } = useApplication();

  const [guessRows, setGuessRows] = useState<string[]>([]);
  const [guessed, setGuessed] = useState(0);
  const currentGuess = useMemo(
    () => guessRows[guessed] ?? "",
    [guessRows, guessed]
  );
  const keyboardState = useMemo(() => {
    let backspace = true;
    let enter = true;
    let letters = true;

    if (guessed >= 6) {
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
  }, [currentGuess]);

  const width = 380;
  const keySpacing = 4;
  const margin = 16;

  function onKeyPress(key: string) {
    if (guessed >= 6) return;

    if (key === "Enter") {
      if (currentGuess.length < 5) return;
      setGuessed(guessed + 1);
    } else if (key === "Backspace") {
      if (!currentGuess.length) return;
      const newRows = [...guessRows];
      newRows[guessed] = newRows[guessed].slice(0, -1);
      setGuessRows(newRows);
    } else if (/[a-zA-Z]/.test(key) && currentGuess.length < 5) {
      const newRows = [...guessRows];
      newRows[guessed] ??= "";
      newRows[guessed] += key.toLowerCase();

      setGuessRows(newRows);
    }
  }

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
            <GuessGrid spacing={keySpacing} guessRows={guessRows} />
          </Box>
        </AspectFrame>
        <Keyboard state={keyboardState} onKeyPress={onKeyPress} />
      </Box>
    </ApplicationWindow>
  );
}
