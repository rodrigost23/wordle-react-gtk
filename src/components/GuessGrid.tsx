import React from "react";
import { Frame, Grid, Gtk } from "react-native-gtk4";
import { GameState } from "../models/GameState";

export default function GuessGrid({
  spacing,
  state,
  correctWord,
}: {
  readonly spacing: number;
  readonly state: GameState;
  readonly correctWord: string;
}) {
  const elementGridItems = [];
  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 5; j++) {
      const letter = state.guessRows[i]?.[j] ?? "";
      const cssClasses = ["guess-frame"];
      if (state.guessed > i) {
        if (correctWord[j] === letter) {
          cssClasses.push("perfect");
        } else if (correctWord.includes(letter)) {
          cssClasses.push("partial");
        } else {
          cssClasses.push("wrong");
        }
      }
      row.push(
        <Grid.Item row={i} col={j} key={`guess-${i}-${j}`}>
          <Frame cssClasses={cssClasses}>{letter.toUpperCase()}</Frame>
        </Grid.Item>
      );
    }
    elementGridItems.push(row);
  }

  return (
    <Grid.Container
      hexpand
      vexpand
      halign={Gtk.Align.FILL}
      valign={Gtk.Align.FILL}
      rowHomogeneous
      columnHomogeneous
      rowSpacing={spacing}
      columnSpacing={spacing}
    >
      {elementGridItems}
    </Grid.Container>
  );
}
