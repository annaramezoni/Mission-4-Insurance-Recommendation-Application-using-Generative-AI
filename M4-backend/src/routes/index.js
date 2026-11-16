import express from "express";
import chatRoutes from "./chatRoutes.js";

const routes = (app) => {
  app.get("/health", (req, res) => {
    res.status(200).send("Server working");
  });

  app.get("/", (req, res) => {
    res.status(200).send("Welcome to our home page");
  });

  app.use(express.json(), chatRoutes);
};

export default routes;
