import {
  GatewayTimeoutError,
  InternalServerError,
} from '@mersocarlin/api-error'

import { startServer } from './fixtures/server'
import fetch from './fetch'

describe('fetch', () => {
  let server: any

  beforeAll(async () => {
    server = await startServer()
  })

  afterAll(done => {
    if (server) {
      server.close(done)
    }
  })

  it('should make get request', async () => {
    const { body, statusCode } = await fetch('http://localhost:3000/api/users')

    expect(statusCode).toEqual(200)
    expect(Array.isArray(body)).toBeTruthy()
  })

  it('should handle 204 no content', async () => {
    const { body, statusCode } = await fetch(
      'http://localhost:3000/api/users',
      {
        method: 'delete',
      }
    )

    expect(statusCode).toEqual(204)
    expect(body).toBeUndefined()
  })

  it('should handle text/html content-type', async () => {
    const { body, statusCode } = await fetch(
      'http://localhost:3000/api/users-html',
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )

    expect(statusCode).toEqual(200)
    expect(typeof body).toEqual('string')
  })

  it('should handle text/plain content-type', async () => {
    const { body, statusCode } = await fetch(
      'http://localhost:3000/api/users-plain',
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )

    expect(statusCode).toEqual(200)
    expect(typeof body).toEqual('string')
  })

  it('should handle timeout', () => {
    expect(fetch('http://localhost:3000/api/users/timeout')).rejects.toEqual(
      new GatewayTimeoutError(
        'request to http://localhost:3000/api/users/timeout failed, reason: connect ECONNREFUSED 127.0.0.1:3000'
      )
    )
  })

  it('should handle error', () => {
    expect(fetch('http://localhost:3000/api/users/error')).rejects.toEqual(
      new InternalServerError(
        'request to http://localhost:3000/api/users/error failed, reason: connect ECONNREFUSED 127.0.0.1:3000'
      )
    )
  })
})
