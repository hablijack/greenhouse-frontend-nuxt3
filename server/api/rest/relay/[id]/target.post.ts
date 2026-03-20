import { z } from 'zod'

const bodySchema = z.object({
  target: z.string().nullable()
})

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  
  if (!session.user) {
    return createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }
  
  const config = useRuntimeConfig()
  
  const relayId = getRouterParam(event, 'id')
  
  if (!relayId) {
    return createError({
      statusCode: 400,
      message: 'Relay ID is required'
    })
  }
  
  const { target } = await readValidatedBody(event, bodySchema.parse)
  
  try {
    const response = await $fetch.raw(`/api/rest/relay/${relayId}/target`, {
      method: 'POST',
      baseURL: config.public.apiBaseUrl,
      headers: {
        'content-type': 'application/json',
        'cookie': event.node.req.headers.cookie || '',
      },
      body: JSON.stringify({ target }),
    })
    
    return response._data
  } catch (error: unknown) {
    const err = error as { message?: string; data?: unknown }
    return createError({
      statusCode: 500,
      statusMessage: err.message || 'Unknown error',
      data: err.data,
    })
  }
})
