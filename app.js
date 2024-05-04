const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const { Sequelize, DataTypes } = require("sequelize");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Initialize Sequelize with your database credentials
const sequelize = new Sequelize("sql6703958", "sql6703958", "BAfaBiNNV6", {
  host: "sql6.freemysqlhosting.net",
  dialect: "mysql",
  pool: {
    max: 10, // Maximum number of connections in the pool
    min: 0, // Minimum number of connections in the pool
    acquire: 30000, // Maximum time, in milliseconds, that a connection can be idle before being released
    idle: 10000, // Maximum time, in milliseconds, that a connection can be idle before being released when the pool is at its maximum size
  },
});

// Define a model for the 'Task' table
const Task = sequelize.define("Task", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  deadLine: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

// Sync the defined model with the database
sequelize.sync();

// POST route to create a new task
app.post("/", async (req, res) => {
  try {
    const { name, deadLine } = req.body;
    const newTask = await Task.create({ name, deadLine });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// GET route to retrieve all tasks
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// PUT route to update a task
app.put("/", async (req, res) => {
  try {
    const { id, name, deadLine, isCompleted } = req.body;
    await Task.update({ name, deadLine, isCompleted }, { where: { id } });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// DELETE route to delete a task by ID
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Task.destroy({ where: { id } });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

module.exports = app;
