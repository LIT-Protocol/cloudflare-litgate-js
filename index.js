import { verifyJwt } from 'lit-jwt-verifier'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  console.log(`request url: ${request.url}`)
  let jwt
  try {
    const params = request.url.split('?')[1].split('&')
    console.log('params', params)
    const jwtParam = params.find(param => param.startsWith('jwt='))
    jwt = jwtParam.split('=')[1]
    console.log('jwt', jwt)
  } catch (e) {
    console.log(e)
    return new Response('no jwt', { status: 400 })
  }

  // LIT Developers: Change this to whatever URL you want to redirect to if auth works properly
  let protectedUrl =
    'https://cdn.cloudflare.steamstatic.com/steam/apps/256843487/movie480_vp9.webm?t=1626712506'

  try {
    const { payload, header, signature, verified } = await verifyJwt(jwt)

    // LIT Developers: change this to the baseURL you are authenticating, path, and other params in the payload
    // so that they match the resourceId that you used when you saved the signing condition to the Lit Protocol
    if (
      !verified ||
      payload.baseUrl !== 'my-dynamic-content-server.com' ||
      // LIT Developers: uncomment the line below and change this to the path you are authenticating
      // payload.path !== '/path-you-expected' ||
      payload.orgId !== '' ||
      payload.role !== '' ||
      payload.extraData !== ''
    ) {
      // Reject this request!
      return new Response('Unauthorized', {
        headers: { 'content-type': 'text/plain' },
        status: 401,
      })
    } else {
      // LIT Developers: This is the success condition. Change this to whatever URL you want to redirect to if auth works properly
      return Response.redirect(protectedUrl, 302)
    }
  } catch (e) {
    console.log('error')
    console.log(JSON.stringify(e, ['message', 'arguments', 'type', 'name']))
    console.log(e.stack)
  }

  return new Response('Unauthorized', {
    headers: { 'content-type': 'text/plain' },
    status: 401,
  })
}
