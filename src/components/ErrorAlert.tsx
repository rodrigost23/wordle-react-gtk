import React from "react";
import {
  ApplicationWindow,
  Box,
  Button,
  Gtk,
  Label,
  useApplication,
} from "react-native-gtk4";

interface Params {
  readonly error: Error;
}

export default function ErrorAlert({ error }: Params) {
  const { quit } = useApplication();

  return (
    <ApplicationWindow
      title="Error"
      defaultWidth={300}
      defaultHeight={0}
      resizable={false}
      modal={true}
      onCloseRequest={quit}
    >
      <Box
        orientation={Gtk.Orientation.VERTICAL}
        hexpand
        vexpand
        spacing={8}
        marginTop={16}
        marginEnd={16}
        marginBottom={16}
        marginStart={16}
      >
        <Label label={error.message} wrap={true} widthRequest={268}></Label>
        <Button label="OK" onClicked={quit}></Button>
      </Box>
    </ApplicationWindow>
  );
}
