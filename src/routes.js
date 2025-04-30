import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.query

      const searchData = {}

      if (title) {
        searchData.title = title
      }

      if (description) {
        searchData.description = description
      }

      const tasks = database.select("tasks", searchData)

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description, completed } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed: completed ? true : false,
        completed_at: completed ? new Date() : null,
        created_at: new Date(),
        updated_at: null,
      }

      database.insert("tasks", task)

      return res.writeHead(201).end()
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description, completed } = req.body

      const task = database.select("tasks").find((task) => task.id === id)

      console.log("task", task)

      if (!task) {
        return res.writeHead(404).end()
      }

      if (title) {
        task.title = title
      }

      if (description) {
        task.description = description
      }

      if (completed !== null) {
        task.completed = completed
        task.completed_at = completed ? new Date() : null
      }

      task.updated_at = new Date()

      database.update("tasks", id, task)

      return res.writeHead(200).end(JSON.stringify(task))
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params

      database.delete("tasks", id)

      return res.writeHead(204).end()
    },
  },
]
