import http from 'node:http'
import { randomUUID } from 'node:crypto'

import { json } from './middlewares/json.js'
import { Database } from './database.js'

const database = new Database()

const server = http.createServer(async (req, res) => {
    const { method, url } = req

    await json(req, res)

    if (method === 'GET' && url === '/tasks') {
        const tasks = database.select('tasks')

        return res.writeHead(200).end(JSON.stringify(tasks))
    }

    if (method === 'POST' && url === '/tasks') {
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

    return res.writeHead(404).end('Rota não encontrada')
})

server.listen(3333)