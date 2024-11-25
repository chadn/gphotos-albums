import { type NextRequest, NextResponse } from 'next/server';

import { libraryApiGetAlbums } from '@/lib/googleApi';

import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({});

  // TODO: figure out how to fix this type error after next-auth version 5.0 gets out of beta
  // Property 'access_token' does not exist on type 'User'.
  // @ts-expect-error: session.user.access_token created in session cb, see auth.ts
  const access_token = session.user.access_token;
  // @ts-expect-error: session.user.refresh_token created in session cb, see auth.ts
  const refresh_token = session.user.refresh_token;

  let useCache = true;
  const params = request.nextUrl.searchParams;
  if (params.has('useCache')) {
    // added || '' to quiet Type error: Object is possibly 'null'.
    (params.get('useCache') || '').match(/^(0|false)$/) && (useCache = false);
  }
  console.log('getAlbums', {
    access_token: access_token,
    refresh_token: refresh_token,
    useCache: useCache,
    session: session,
  });

  // TODO: based on useCache, opt in/out of caching
  // https://nextjs.org/docs/14/app/building-your-application/routing/route-handlers#opting-out-of-caching

  // if testing, use const data = getFakeAlbumsData();

  const data = await libraryApiGetAlbums(access_token);
  if (401 == data.statusCode) {
    console.log('getAlbums:401 need to refresh access_token');
  }
  if (data.error) {
    // Error occured during the request. Albums could not be loaded.
    console.log('getAlbums: libraryApiGetAlbums', data);
    return NextResponse.json({
      error: 'Could not fetch from Google API, see logs',
    });
  } else {
    return NextResponse.json(data);
  }
}
