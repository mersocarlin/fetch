import isomorphicFetch from 'isomorphic-fetch'
import {
  ApiError,
  InternalServerError,
  GatewayTimeoutError,
} from '@mersocarlin/api-error'

interface RequestOptions {
  body?: object
  headers?: Record<string, string>
  method?: 'delete' | 'get' | 'patch' | 'post' | 'put'
}

export interface FetchResponse {
  body: any
  statusCode: number
}

const fetch = async (
  url: string,
  options?: RequestOptions
): Promise<FetchResponse> => {
  try {
    const defaultOptions: RequestOptions = {
      body: undefined,
      headers: {},
      method: 'get',
      ...(options || {}),
    }

    const response: Response = await isomorphicFetch(url, {
      body: defaultOptions.body
        ? JSON.stringify(defaultOptions.body)
        : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...defaultOptions.headers,
      },
      method: defaultOptions.method,
    })

    let contentType = response.headers.get('Content-Type')
    if (contentType !== null) {
      contentType = contentType.split(';')[0]
    }

    let jsonResponse

    switch (contentType) {
      case 'application/json': {
        jsonResponse = await response.json()
        break
      }
      case 'text/html':
      case 'text/plain': {
        jsonResponse = await response.text()
        break
      }
      default: {
        if (response.status !== 204) {
          jsonResponse = `Unknown response from Content-Type = ${contentType}`
        }
      }
    }

    return {
      body: jsonResponse,
      statusCode: response.status,
    }
  } catch (error) {
    if (!error.code) {
      throw new InternalServerError(error.message)
    }

    switch (error.code) {
      default:
        throw new ApiError(error.message, error.code)
      case 'ECONNREFUSED':
        throw new InternalServerError(error.message)
      case 'ECONNRESET':
        throw new GatewayTimeoutError(error.message)
    }
  }
}

export default fetch
