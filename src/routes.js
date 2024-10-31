import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import path from 'node:path'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks')

      return res.writeHead(200).end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null
      }

      database.insert('tasks', task)

      return res.writeHead(201).end('Tarefa criada com sucesso!')
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const response = database.update('tasks', id, { title, description })

      if (response) {
        return res.writeHead(200).end('Tarefa alterada com sucesso!')
      } else {
        return res.writeHead(404).end('Tarefa não encontrada!')
      }
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const response = database.delete('tasks', id)

      if (response) {
        return res.writeHead(204).end()
      } else {
        return res.writeHead(404).end('Tarefa não encontrada!')
      }
      
    }
  }
]