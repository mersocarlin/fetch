import isomorphicFetch from 'isomorphic-fetch'
import {
  ApiError,
  InternalServerError,
  GatewayTimeoutError,
} from '@mersocarlin/api-error'

import { FetchResponse, RequestOptions } from '../types'

async function fetch(
  url: string,
  options?: RequestOptions
): Promise<FetchResponse> {
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

    if (contentType === 'application/json') {
      jsonResponse = await response.json()
    } else if (contentType === 'text/html' || contentType === 'text/plain') {
      jsonResponse = await response.text()
    } else {
      if (response.status !== 204) {
        jsonResponse = `Unknown response from Content-Type = ${contentType}`
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

    if (error.code === 'ECONNREFUSED') {
      throw new InternalServerError(error.message)
    } else if (error.code === 'ECONNRESET') {
      throw new GatewayTimeoutError(error.message)
    } else {
      throw new ApiError(error.message, error.code)
    }
  }
}

export default fetch
