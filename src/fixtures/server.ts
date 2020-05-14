import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'

const users = Array.from({ length: 10 }).map((_, index) => ({
  id: index,
  name: `User ${index}`,
}))

export const startServer = ({ port = process.env.PORT } = {}) => {
  const app = express()
  app.use(bodyParser.json())

  const router = express.Router()
  router.get('/users', (_req: Request, res: Response) => res.send(users))
  router.delete('/users', (_req: Request, res: Response) =>
    res.status(204).send()
  )
  router.get('/users-html', (_req: Request, res: Response) => {
    res.set('Content-Type', 'text/html').send(users)
  })
  router.get('/users-plain', (_req: Request, res: Response) => {
    res.set('Content-Type', 'text/plain').send(users)
  })
  router.get('/users/timeout', (_req: Request, _res: Response) => {
    _req.setTimeout(100)
    _res.setTimeout(100)
  })
  router.get('/users/error', () => {
    throw new Error('Something went wrong!')
  })

  app.use('/api', router)

  return new Promise(resolve => {
    const server = app.listen(port, () => {
      resolve(server)
    })
  })
}
