import * as ko from 'knockout'

enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  DELETE = 'DELETE'
}

type APIHelperFetchOptions = {
  query?: { [k: string]: any }
}

type APIHelperUpdateOptions = {
  query?: { [k: string]: any }
  data?: { [k: string]: any }
}

type APIHelperFetchMethod = {
  (opts?: APIHelperFetchOptions): Promise<any>
  (endpoint?: string, opts?: APIHelperFetchOptions): Promise<any>
}

type APIHelperUpdateMethod = {
  (opts?: APIHelperUpdateOptions): Promise<any>
  (endpoint?: string, opts?: APIHelperUpdateOptions): Promise<any>
}

type ApiHelperConfig = {
  query: { [k: string]: any }
}

export class ApiHelper {
  private baseURL: string

  private static readonly globalConfig: ApiHelperConfig = {
    query: {}
  }

  private static readonly requestInit: RequestInit = {
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-cache',
    credentials: 'same-origin',
    redirect: 'follow'
  }

  constructor(controller: string) {
    this.baseURL = '/api/' + controller
  }

  public get: APIHelperFetchMethod = this.createRequestMethod(HTTPMethod.GET)
  public post: APIHelperUpdateMethod = this.createRequestMethod(HTTPMethod.POST)
  public delete: APIHelperUpdateMethod = this.createRequestMethod(
    HTTPMethod.DELETE
  )

  public download(endpoint: string, opts: APIHelperUpdateOptions = {}) {
    let url = this.baseURL + '/' + endpoint
    if (opts.query) {
      url += '?' + this.stringifyQuery(opts.query)
    }
    window.location.href = url
  }

  private createRequestMethod(method: HTTPMethod) {
    return async (arg1: any = {}, arg2: any = {}) => {
      let endpoint: string
      let opts: APIHelperFetchOptions & APIHelperUpdateOptions

      if (typeof arg1 === 'string') {
        endpoint = arg1
        opts = arg2
      } else {
        endpoint = ''
        opts = arg1
      }

      const requestInit = {
        ...ApiHelper.requestInit,
        method
      }

      const url = this.constructUrl(endpoint, ko.toJS(opts.query))

      if (method !== 'GET' && typeof opts.data !== 'undefined') {
        requestInit.body = ko.toJSON(opts.data)
      }

      const res = await fetch(url, requestInit)

      if (res.status < 200 || res.status >= 300) {
        throw new Error(`API Error: ${res}`)
      }

      try {
        return await res.json()
      } catch (e) {
        return
      }
    }
  }

  private constructUrl(endpoint: string, query: { [k: string]: any } = {}) {
    let url = this.baseURL + endpoint.replace(/^\/?(.+)$/, '/$1') // replace leading double /

    if (ApiHelper.globalConfig.query) {
      Object.assign(query, ApiHelper.globalConfig.query)
    }

    if (Object.keys(query).length > 0) {
      url += '?' + this.stringifyQuery(query)
    }

    return url
  }

  private stringifyQuery(query: { [k: string]: any } = {}): string {
    const encode = (k: string) => {
      const v = query[k]
      return Array.isArray(v)
        ? v.map((vi) => `${k}[]=${encodeURIComponent(vi)}`)
        : [`${k}=${encodeURIComponent(v)}`]
    }
    const flatten = (accum: string[], v: string[]) => [...accum, ...v]
    return Object.keys(ko.toJS(query))
      .map(encode)
      .reduce(flatten, [])
      .join('&')
  }

  public static setConfig(config: ApiHelperConfig) {
    Object.assign(this.globalConfig, config)
  }
}
