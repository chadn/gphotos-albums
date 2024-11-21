import { type NextRequest, NextResponse } from 'next/server';

import { getFakeAlbumsData } from '@/lib/googleApi';

import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({});

  // TODO: figure out how to fix after 5 beta: Property 'access_token' does not exist on type 'User'.
  // @ts-expect-error: session.user.access_token created in session cb, see auth.ts
  const access_token = session.user.access_token;

  let useCache = true;
  const params = request.nextUrl.searchParams;
  if (params.has('useCache')) {
    // added || '' to quiet ... Type error: Object is possibly 'null'.
    (params.get('useCache') || '').match(/^(0|false)$/) && (useCache = false);
  }
  useCache &&
    console.log('getAlbums', {
      access_token: access_token,
      session: session,
    }); // quiet warnings about useCache

  // TODO: based on useCache, opt in/out of caching
  // https://nextjs.org/docs/14/app/building-your-application/routing/route-handlers#opting-out-of-caching

  //const data = await libraryApiGetAlbums(session.user.token);
  const data = getFakeAlbumsData();
  if (data.error) {
    // Error occured during the request. Albums could not be loaded.
    return NextResponse.json({
      error: 'Could not fetch from Google API, see logs',
    });
  } else {
    return NextResponse.json(data);
  }
}
