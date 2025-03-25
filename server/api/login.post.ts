import { z } from 'zod'

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

interface User {
  name: string;
  username: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  if (!config.public || !config.public.apiBaseUrl) {
    throw new Error('Missing `runtimeConfig.apiBaseUrl` configuration.');
  }

  const { email, password } = await readValidatedBody(event, bodySchema.parse)
  const response = await $fetch.raw(config.public.apiBaseUrl + "/api/rest/authenticate", {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({ username: email, password }),
  });


  if (response._data && response.status && response.status === 200) {
    const { name, username } = response._data as User;
    await setUserSession(event, {
      user: {
        name: name,
        email: username
      }
    })
    return {}
  }
  throw createError({
    statusCode: 401,
    message: 'Bad credentials'
  })
})