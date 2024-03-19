import React from "react";
import { Frame, Grid, Gtk } from "react-native-gtk4";
import { GameState } from "../models/GameState";

export default function GuessGrid({
  spacing,
  state,
}: {
  readonly spacing: number;
  readonly state: GameState;
}) {
  const elementGridItems = [];
  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 5; j++) {
      const letter = state.guessRows[i]?.[j] ?? "";
      row.push(
        <Grid.Item row={i} col={j} key={`guess-${i}-${j}`}>
          <Frame cssClasses={["guess-frame"]}>{letter.toUpperCase()}</Frame>
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
