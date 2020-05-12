# @mersocarlin/fetch

`fetch` wrapper on top of `isomorphic-fetch`.

## Motivation

I needed a consistent `fetch` wrapper that always returns the same structure (`body` and `statusCode`) for all API calls throughout my projects.

Basic error handling was also a "_must-have_" and I ended up duplicating the same code in every new project/repository I was working on.

I've also written this code a long time ago but never had the chance to give it the attention it deservs + open source it.

It works seamless with [@mersocarlin/mersocarlin/api-error](https://github.com/mersocarlin/api-error) so I get named API errors for free.

## Install

```bash
yarn add @mersocarlin/fetch
```

```bash
npm i @mersocarlin/fetch
```

## Usage

```ts
import fetch from '@mersocarlin/fetch'

const login = async (username: string, password: string) => {
  try {
    const { body, statusCode } = await fetch('https://example.com/api/signin', {
      body: {
        username,
        password,
      },
      method: 'post',
    })

    return body
  } catch(error) {
    throw error
  }
}

const fetchPrivateUsers = async () => {
  try {
    const { body, statusCode } = await fetch('https://example.com/api/users', {
      headers: {
        'Authorization': 'Bearer TOKEN',
      }
    })

    return body
  } catch(error) {
    throw error
  }
}

const fetchPublicUsers = async () => {
  try {
    const { body, statusCode } = await fetch('https://example.com/users')

    return body
  } catch(error) {
    throw error
  }
}
```
