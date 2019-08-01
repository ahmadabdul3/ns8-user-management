import "core-js/stable";
import "regenerator-runtime/runtime";
import fs from 'fs';
import path from 'path';
import repl from 'repl';
import db from 'src/db/models';

const { sequelize } = db;
const envName = process.env.NODE_ENV || "dev";

// open the repl session
const replServer = repl.start({
  prompt: "app - " + envName + " >> ",
});

// attach my modules to the repl context
replServer.context.db = db;
replServer.context.path = path;
replServer.context.fs = fs;
replServer.context.dirname = __dirname;
replServer.context.filename = __filename;
