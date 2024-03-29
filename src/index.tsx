import React from "react";
import render, { Gio, Gtk } from "react-native-gtk4";
import App from "./components/App.js";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";
import { Sequelize } from "sequelize-typescript";
import ErrorAlert from "./components/ErrorAlert.js";

let dataLocation: string | undefined =
  process.env.APPDATA ??
  (process.platform == "darwin"
    ? path.join(os.homedir(), "Library", "Preferences")
    : process.env.XDG_DATA_HOME ?? path.join(os.homedir(), ".local", "share"));

dataLocation = path.join(dataLocation, "wordle-gtk");

// fs.mkdirSync(dataLocation);

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

sequelize
  .sync()
  .then((sequelize) => {
    render(<App sequelize={sequelize} />, application);
  })
  .catch((err: Error) => {
    render(<ErrorAlert error={err} />, application);
  });
