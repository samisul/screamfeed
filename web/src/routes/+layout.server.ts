import { getParsedFeedsFromURLs } from '$lib/feed';

export async function load() {
  return {
    feeds: await getParsedFeedsFromURLs([
      'https://www.youtube.com/feeds/videos.xml?channel_id=UC3cpN6gcJQqcCM6mxRUo_dA'
    ])
  };
}
