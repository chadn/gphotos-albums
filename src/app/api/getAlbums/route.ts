import { type NextRequest, NextResponse } from 'next/server';

import { getFakeAlbumsData } from '@/lib/googleApi';

import { auth } from '@/auth';

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({});

  let useCache = true;
  const params = request.nextUrl.searchParams;
  if (params.has('useCache')) {
    // added || '' to quiet ... Type error: Object is possibly 'null'.
    (params.get('useCache') || '').match(/^(0|false)$/) && (useCache = false);
  }
  useCache && console.log('useCache'); // quiet warnings
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
