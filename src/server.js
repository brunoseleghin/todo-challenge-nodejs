import http from 'node:http'
import { randomUUID } from 'node:crypto'

const tasks = []

const server = http.createServer(async (req, res) => {
    const { method, url } = req

    const buffers = []

    for await (const chunk of req) {
        buffers.push(chunk)
    }

    try {
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch {
        req.body = null
    }

    if (method === 'GET' && url === '/tasks') {
        return res
            .setHeader('Content-Type', 'application/json')
            .writeHead(200)
            .end(JSON.stringify(tasks))
    }

    if (method === 'POST' && url === '/tasks') {
        const { title, description } = req.body

        tasks.push({
            id: randomUUID(),
            title,
            description,
            completed_at: null,
            created_at: new Date(),
            updated_at: null
        })

        return res.writeHead(201).end('Criação da tarefa realizada com sucesso!')
    }

    return res.writeHead(404).end('Rota não encontrada')
})

server.listen(3333)