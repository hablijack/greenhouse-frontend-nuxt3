import { createError, readBody, appendHeader } from 'h3';

export default defineEventHandler(async (event) => {
  requireUserSession(event);
  const config = useRuntimeConfig();

  if (!config.public || !config.public.apiBaseUrl) {
    throw new Error('Missing `runtimeConfig.apiBaseUrl` configuration.');
  }

  const { method, url, headers } = event.node.req;
  const body = method !== 'GET' && method !== 'HEAD' ? await readBody(event) : undefined;

  try {
    const response = await $fetch.raw(url, {
      method,
      baseURL: config.public.apiBaseUrl,
      headers: {
        'content-type': 'application/json',
        cookie: headers.cookie,
      },
      body,
    });
    for (const header of ['set-cookie', 'cache-control']) {
      if (response.headers.has(header)) {
        appendHeader(event, header, response.headers.get(header));
      }
    }

    return response._data;
  } catch (error) {
    return createError({
      statusCode: error.response.status,
      statusMessage: error.message,
      data: error.data,
    });
  }
});
