import express from "express";
import home from "../controllers/home.js";

const route = express.Router();

route.get('/', home.index);

export default route;