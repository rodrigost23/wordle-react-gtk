import React, { Fragment } from "react";
import { Box, Button, Gtk } from "react-native-gtk4";

export default function Keyboard({
  onKeyPress,
  state,
}: {
  onKeyPress?: (key: string) => void;
  state?: {
    enter: boolean;
    backspace: boolean;
    letters: boolean;
  };
}) {
  const keyRows = ["QWERTYUIOP", "ASDFGHJKL", "-ZXCVBNM*"];
  const width = 380;
  const keySpacing = 4;
  const margin = 16;
  const totalHorizontalSpacing = keySpacing * keyRows[0].length - margin;
  const keySize = (width - totalHorizontalSpacing) / keyRows[0].length;

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
              sensitive={state?.enter ?? true}
              onNotifySensitive={onEnterNotifySensitive}
              widthRequest={keySize}
              heightRequest={keySize}
              onClicked={() => onKeyPress?.("Enter")}
            />
          );
        } else {
          element = (
            <Button
              label={letter}
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
