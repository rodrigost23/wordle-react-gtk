import * as os from "os";
import * as path from "path";
import React from "react";
import render, { Gio, Gtk } from "react-native-gtk4";
import { Sequelize } from "sequelize-typescript";
import App from "./components/App.js";
import ErrorAlert from "./components/ErrorAlert.js";
import { GameState } from "./models/GameState.js";
import { getTodayWord } from "./words.js";

let dataLocation: string | undefined =
  process.env.APPDATA ??
  (process.platform == "darwin"
    ? path.join(os.homedir(), "Library", "Preferences")
    : process.env.XDG_DATA_HOME ?? path.join(os.homedir(), ".local", "share"));

dataLocation = path.join(dataLocation, "wordle-gtk");

const application = new Gtk.Application(
  "com.rodrigotavares.wordle",
  Gio.ApplicationFlags.DEFAULT_FLAGS
);

const sequelize = new Sequelize({
  database: "wordle-gtk",
  dialect: "sqlite",
  username: "root",
  password: "",
  storage: path.join(dataLocation, "data.db"),
  models: [path.normalize(path.join(__dirname, "models"))],
});

const today = new Date();
today.setHours(0, 0, 0, 0);

(async () => {
  await sequelize.sync();
  return (
    (await GameState.findOne({ where: { date: today } })) ??
    GameState.build({ date: today, solution: getTodayWord() })
  );
})()
  .then((initialState) => {
    render(<App initialState={initialState} />, application);
  })
  .catch((error: Error) => {
    render(<ErrorAlert error={error} />, application);
  });
