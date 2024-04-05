import * as path from "path";
import React, { useMemo, useState } from "react";
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
  Overlay,
  useActionGroup,
  useApplication,
  useMenu,
  useStylesheet,
} from "react-native-gtk4";
import { useGameState } from "../hooks/useGameState";
import { useKeyPressHandler } from "../hooks/useKeyPressHandler";
import { useKeyboardState } from "../hooks/useKeyboardState";
import { GameState } from "../models/GameState";
import GuessGrid from "./GuessGrid";
import Keyboard from "./Keyboard";
import { Toast } from "./Toast";

interface Props {
  readonly initialState: GameState;
}

export default function App({ initialState }: Props) {
  useStylesheet(path.normalize(__dirname + "/../data/styles.css"));
  const { quit, application } = useApplication();
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [state, updateState] = useGameState(initialState);
  const onKeyPress = useKeyPressHandler(state, updateState);
  const keyboardState = useKeyboardState(state);

  // Events
  const onAddWindow = (window: Gtk.Window): void => {
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
  };

  const onAboutClick = () => {
    setShowAboutDialog(true);
  };

  function onClose() {
    GameState.upsert(state.dataValues);
    return quit();
  }

  // ----

  const menu = useMenu([{ label: "About", action: "menu.about" }], []);
  const actions = useActionGroup({ about: onAboutClick }, [menu]);
  application.connect("window-added", onAddWindow);

  const message: string = useMemo(() => {
    if (state.error !== null) {
      return state.error;
    }

    if (state.isSolved) {
      return "Congratulations!";
    }

    if (state.isFinished) {
      return `The correct word was "${state.solution}"`;
    }

    return "";
  }, [state.isFinished, state.error]);

  const keySpacing = 4;
  const margin = 16;

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
        <Overlay
          content={
            <AspectFrame
              hexpand
              vexpand
              halign={Gtk.Align.FILL}
              valign={Gtk.Align.FILL}
              ratio={5 / 6}
              obeyChild={false}
            >
              <Box
                hexpand
                vexpand
                halign={Gtk.Align.FILL}
                valign={Gtk.Align.FILL}
                marginBottom={margin}
              >
                <GuessGrid
                  spacing={keySpacing}
                  state={state}
                  correctWord={state.solution}
                />
              </Box>
            </AspectFrame>
          }
        >
          <Box hexpand vexpand halign={Gtk.Align.CENTER}>
            <Toast title={message} timeout={state.isFinished ? 0 : 3}></Toast>
          </Box>
        </Overlay>
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
