import React, { Fragment, useState } from "react";
import {
  ApplicationWindow,
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

export default function App() {
  const [guessRows, setGuessRows] = useState(["asd"]);
  const { quit } = useApplication();

  useStylesheet("data/styles.css");

  const keyRows = ["qwertyuiop", "asdfghjkl", "-zxcvbnm*"];
  const width = 380;
  const keySpacing = 4;
  const totalHorizontalSpacing = keySpacing * keyRows[0].length;
  const margin = 16;
  const keySize = (width - totalHorizontalSpacing) / keyRows[0].length;

  const elementGridItems = [];
  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 5; j++) {
      const letter = guessRows[i]?.[j] ?? "";
      row.push(
        <Grid.Item row={i} col={j} key={`guess-${i}-${j}`}>
          <Frame cssClasses={["guess-frame"]}>{letter.toUpperCase()}</Frame>
        </Grid.Item>
      );
    }
    elementGridItems.push(row);
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
        <Grid.Container
          hexpand
          vexpand
          halign={Gtk.Align.FILL}
          valign={Gtk.Align.FILL}
          marginStart={48}
          marginEnd={48}
          marginBottom={24}
          rowHomogeneous
          columnHomogeneous
          rowSpacing={keySpacing}
          columnSpacing={keySpacing}
        >
          {elementGridItems}
        </Grid.Container>
        {keyRows.map((row) => (
          <Box
            key={row}
            orientation={Gtk.Orientation.HORIZONTAL}
            halign={Gtk.Align.CENTER}
            heightRequest={60}
            spacing={4}
          >
            {row.split("").map((letter) => {
              let element;
              if (letter === "-") {
                element = (
                  <Button
                    label="DELETE"
                    widthRequest={keySize}
                    heightRequest={keySize}
                  />
                );
              } else if (letter === "*") {
                element = (
                  <Button
                    label="ENTER"
                    widthRequest={keySize}
                    heightRequest={keySize}
                  />
                );
              } else {
                element = (
                  <Button
                    label={letter}
                    widthRequest={keySize}
                    heightRequest={keySize}
                  />
                );
              }
              return <Fragment key={letter}>{element}</Fragment>;
            })}
          </Box>
        ))}
      </Box>
    </ApplicationWindow>
  );
}
