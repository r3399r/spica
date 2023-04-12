import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { successOutput } from 'src/util/LambdaOutput';

export async function manifest(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  const res = {
    short_name: 'Bunny Bill',
    name: 'Bunny Bill',
    icons: [
      {
        src: '/logo/icon-android-72.png',
        sizes: '16x16 24x24 32x32 64x64 72x72',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/logo/icon-android-96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/logo/icon-android-128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/logo/icon-android-144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/logo/icon-android-152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/logo/icon-android-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/logo/icon-android-384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/logo/icon-android-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    start_url: `/book?id=${event.queryStringParameters?.id}`,
    display: 'standalone',
    theme_color: '#ffffff',
    background_color: '#ffffff',
  };

  return successOutput(res);
}
