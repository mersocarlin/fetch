export interface RequestOptions {
  body?: object
  headers?: Record<string, string>
  method?: 'delete' | 'get' | 'patch' | 'post' | 'put'
}

export interface FetchResponse {
  body: any
  statusCode: number
}

export default function fetch(
  url: string,
  options?: RequestOptions
): Promise<FetchResponse>
