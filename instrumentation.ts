import * as Sentry from '@sentry/nextjs';

export function register() {
  if (
    process.env.NEXT_RUNTIME === 'nodejs' ||
    process.env.NEXT_RUNTIME === 'edge'
  ) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: parseFloat(
        process.env.NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE ?? '0.0'
      ),
      debug: false,
    });
  }
}

export function onRequestError(
  err: unknown, 
  request: Request, 
  context: { 
    routerKind: string;
    routePath?: string;
    routeType?: string;
  }
) {
  Sentry.setContext('request', {
    path: new URL(request.url).pathname,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
  });

  Sentry.setContext('route', {
    routerKind: context.routerKind,
    routePath: context.routePath || new URL(request.url).pathname,
    routeType: context.routeType || 'page',
  });

  Sentry.captureException(err);
}