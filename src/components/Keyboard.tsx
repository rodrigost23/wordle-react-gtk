import React, { Fragment } from "react";
import { Box, Button, Gtk } from "react-native-gtk4";
import { LetterStatus } from "../words";

export interface KeyboardState {
  enter: boolean;
  backspace: boolean;
  letters: boolean;
  letterStatus: Record<string, LetterStatus>;
}

export default function Keyboard({
  onKeyPress,
  state,
}: {
  onKeyPress?: (key: string) => void;
  state?: KeyboardState;
}) {
  const keyRows = ["QWERTYUIOP", "ASDFGHJKL", "-ZXCVBNM*"];
  const width = 380;
  const keySpacing = 4;
  const margin = 16;
  const totalHorizontalSpacing = keySpacing * keyRows[0]!.length - margin;
  const keySize = (width - totalHorizontalSpacing) / keyRows[0]!.length;

  function onEnterNotifySensitive(node: Gtk.Widget): void {
    if (node.sensitive) {
      node.grabFocus();
    }
  }

  return keyRows.map((row) => (
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
              sensitive={state?.backspace ?? true}
              focusable={false}
              widthRequest={keySize}
              heightRequest={keySize}
              onClicked={() => onKeyPress?.("Backspace")}
            />
          );
        } else if (letter === "*") {
          element = (
            <Button
              label="ENTER"
              cssClasses={["suggested-action"]}
              sensitive={state?.enter ?? true}
              onNotifySensitive={onEnterNotifySensitive}
              widthRequest={keySize}
              heightRequest={keySize}
              onClicked={() => onKeyPress?.("Enter")}
            />
          );
        } else {
          const cssClasses = ["opaque"];
          const status = state?.letterStatus?.[letter.toLowerCase()];

          if (status) {
            cssClasses.push(status);
          }

          element = (
            <Button
              label={letter}
              cssClasses={cssClasses}
              sensitive={state?.letters ?? true}
              focusable={false}
              widthRequest={keySize}
              heightRequest={keySize}
              onClicked={() => onKeyPress?.(letter.toLowerCase())}
            />
          );
        }
        return <Fragment key={letter}>{element}</Fragment>;
      })}
    </Box>
  ));
}
