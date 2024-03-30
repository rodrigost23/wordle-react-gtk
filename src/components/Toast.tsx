import Adw from "@girs/node-adw-1";
import React, { useEffect, useRef } from "react";
import { Box, Gtk } from "react-native-gtk4";

interface Props {
  readonly title: string | null;
  readonly timeout?: number;
}

export function Toast({ title, timeout }: Props) {
  const boxRef = useRef<Gtk.Box>(null);

  useEffect(() => {
    const box = boxRef.current;

    if (!box || !title) return;

    const overlay = new Adw.ToastOverlay();
    const toast = new Adw.Toast({ title, timeout });

    overlay.addToast(toast);
    box.append(overlay as unknown as Gtk.Widget);
  }, [title]);

  return <Box orientation={Gtk.Orientation.VERTICAL} ref={boxRef} />;
}
