import express from "express";
import webRouter from '../routes/web.js';

const web = express();

web.use(express.json());
web.use(express.static('./src/public'));
web.set("views", "./src/views");
web.set("view engine", "ejs");
web.use(webRouter);

export default web;