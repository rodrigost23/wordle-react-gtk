import React from "react";
import { Frame, Grid, Gtk } from "react-native-gtk4";
import { GameState } from "../models/GameState";
import { checkGuess } from "../words";

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
    const checked = checkGuess(state.guessRows[i] ?? "", correctWord);
    const row = [];
    for (let j = 0; j < 5; j++) {
      const letter = state.guessRows[i]?.[j] ?? "";
      const cssClasses = ["guess-frame"];
      if (state.guessed > i) {
        cssClasses.push(checked[j]);
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
