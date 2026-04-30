import { NextResponse } from 'next/server'
 
export function middleware(request) {
  // console.log("middleware")
  // Clone the request headers and set a new header `x-hello-from-middleware1`
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('Cache-Control', 'no-store')
 
  // You can also set request headers in NextResponse.next
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  })
 
  // Set a new response header `x-hello-from-middleware2`
  response.headers.set('Cache-Control', 'no-store')
  return response
}