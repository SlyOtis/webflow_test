type RedditImage = {
  url: string
} & ImageResolution

type RedditPreviewImage = {
  id: string
  title: string
  resolutions: Array<RedditImage>
  source: RedditImage
  url?: string
}

type RedditPostPreview = {
  enabled: boolean
  images: Array<RedditPreviewImage>
}

type RedditPost = {
  title: string
  post_hint: 'image' | any
  preview?: RedditPostPreview
  url?: string
  url_overridden_by_dest?: string
}

export type SubReddit = {
  name: string
  r: string
  flair?: string
  sort?: 'hot' | 'new' | 'top' | 'rising'
}

const defaultSubreddits: Array<SubReddit> = [
  {
    name: 'Wallpapers',
    r: 'wallpapers'
  },
  {
    name: 'EDM',
    r: 'EDM',
    flair: 'Photo'
  },
  {
    name: 'Offencive Wallpapers',
    r: 'Offensive_Wallpapers'
  }
]

interface ImageResolution {
  width: number,
  height: number
}

interface RedditPreviewConfig extends RedditConfig {
  sourceOnly: boolean
  resolutionMin?: ImageResolution
  resolutionMax?: ImageResolution
  preferredSize?: 'smallest' | 'largest' | 'middle'
}

interface RedditConfig {
  baseUrl: string
}

export const defaultConfig: RedditConfig = {
  baseUrl: "https://www.reddit.com",
}


//
// class RedditState {
//   public static state: RedditConfig = defaultConfig;
// }
//
// const state: RedditState = new RedditState()
//
// export function init(config: RedditConfig) {
//   state.state = config
// }

const state: RedditConfig | RedditPreviewConfig = defaultConfig

function validResolution() {

}

export function getRedditApiUrl(sub: SubReddit) {
  return `${state.baseUrl}/r/${sub.r}` + (
    sub.sort ? `/${sub.sort}/` : ''
  ) + '.json' + (
    sub.flair ? '?f=' + encodeURI(`flair_name:"${sub.flair}"`) : ''
  )
}

function extractPreviewImages(prev: Array<RedditPreviewImage>, curr: { data: RedditPost }): Array<RedditPreviewImage> {
  if ('data' in curr) {
    if (curr.data.post_hint === 'image' && 'preview' in curr.data) {
      if (curr.data.preview.enabled && 'images' in curr.data.preview && Array.isArray(curr.data.preview.images)) {
        if (curr.data.preview.images.length > 0) {
          const image = curr.data.preview.images[0]

          if (image)

            return [
              ...prev,
              {
                id: image.id,
                title: curr.data.title,
                resolutions: image.resolutions,
                source: image.source,
                url: curr.data.url ?? curr.data.url_overridden_by_dest
              }
            ] //TODO:: Determine which one of these to return.
        }
      }
    }
  }

  return prev
}


function sortByImageSize(a: RedditImage, b: RedditImage) {
  if (a.width > b.width && a.height > b.height) {
    return 1
  } else if (a.width < b.width && a.height < b.height) {
    return -1
  }

  return 0
}

function aboveSize(test: ImageResolution, res: ImageResolution | undefined | null) {
  return !res ? true : test.width >= res.width && test.height >= res.height
}

function belowSize(test: ImageResolution, res: ImageResolution | undefined | null) {
  return !res ? true : test.width <= res.width && test.height <= res.height
}

function isValidSize(_state: RedditPreviewConfig, img: RedditPreviewImage): boolean {
  if (_state.sourceOnly) {
    return aboveSize(img.source, _state.resolutionMin) && belowSize(img.source, _state.resolutionMax)
  }

  let resolutions = img.resolutions
  if (_state.resolutionMin) {
    resolutions = resolutions.filter(val => aboveSize(val, _state.resolutionMin))
  }

  if (_state.resolutionMax) {
    resolutions = resolutions.filter(val => aboveSize(val, _state.resolutionMin))
  }

  console.log(resolutions)

  return resolutions.length >= 1
}


export const getImages = (sub: SubReddit = defaultSubreddits[0]): Promise<Array<RedditPreviewImage>> => fetch(getRedditApiUrl(sub), {
  method: 'GET'
}).then(resp => {
  if (resp.ok) {
    return resp.json()
  }
  return null
}).then(res => res ? res.data.children : [])
  .then((res: Array<{ data: RedditPost }>) => res.reduce(extractPreviewImages, []) as Array<RedditPreviewImage>)
  .catch(err => {
    console.error(err)
    return []
  })

export const getRedditImages = (sub: SubReddit = defaultSubreddits[0]): Promise<Array<RedditImage>> => getImages(sub)
  .then(res => res.map(previewToReddit))

export const getImagesFitted = (sub: SubReddit = defaultSubreddits[0]): Promise<Array<RedditPreviewImage>> => getImages(sub)
  .then(res => {
    if ('sourceOnly' in state) {
      return res.filter(val => isValidSize(state as any, val))
    }
    return res
  })


function getPreferredSize(img: RedditPreviewImage): RedditImage {
  const resolutions = img.resolutions.sort(sortByImageSize)
  switch (state['prefferedSize']) {
    case "largest":
      return resolutions[resolutions.length - 1]
    case "middle":
      return resolutions[Math.floor(resolutions.length / 2)]
    case "smallest":
      return resolutions[0]
  }
}

function previewToReddit(img: RedditPreviewImage): RedditImage {
  if ('prefferedSize' in state) {
    return getPreferredSize(img)
  }

  return {
    url: img.url,
    width: -1,
    height: -1
  }
}

export const getRandomImage = (sub: SubReddit = defaultSubreddits[0]): Promise<RedditImage | null> => getImagesFitted(sub).then((images) => {
  const index = Math.floor(Math.random() * images.length - 1);
  if (index < 0) {
    throw new Error('No images withing the given search paramtres')
  }
  return images[index]
}).then(img => previewToReddit(img))
  .catch(err => {
    console.error(err)
    //TODO:: Return built-in default here
    return null
  })

export type RedditCacheCursor = {
  start: number
}

export type RedditCache = {
  currentCursor?: {
    key: string
    index: number
  }
  cursors: {
    [key: string]: RedditCacheCursor
  },
  images: {
    [key: string]: Array<RedditImage>
  }
}

function getCachedState(): RedditCache | null {
  const cache = localStorage.getItem('reddit_images')
  if (localStorage.getItem('reddit_images')) {
    try {
      return JSON.parse(cache) as RedditCache
    } catch (ex) {
      console.error(ex)
    }
  }
  return null
}

function setCachedState(cache: RedditCache): RedditCache {
  localStorage.setItem('reddit_images', JSON.stringify(cache))
  return cache
}

function updateCachedState(updater: (state: RedditCache) => RedditCache): RedditCache {
  const existing = getCachedState() || {
    cursors: {},
    images: {}
  }

  const next: RedditCache = updater(existing)
  return setCachedState(next)
}


function getCachedImage(): RedditImage | null {
  const cache = getCachedState()
  if (cache) {

    if (!cache.currentCursor) {
      const keys = Object.keys(cache.cursors)
      cache.currentCursor = {
        key: keys[0],
        index: 0
      }
    }

    let {
      key,
      index
    } = cache.currentCursor

    const images = cache.images[key]
    const cursor = cache.cursors[key]

    if (cursor.start >= images.length) {
      // Reset cursor go to next
      cache.cursors[key] = {
        ...cursor,
        start: 0
      }

      const keys = Object.keys(cache.cursors)
      index++

      if (index >= keys.length) {
        index = 0
      }

      cache.currentCursor = {
        key: keys[index],
        index
      }

      setCachedState(cache)
      return getCachedImage()
    }

    const image = images[cursor.start]
    cursor.start++
    cache.cursors[key] = cursor
    setCachedState(cache)

    return image
  }

  return null
}

export async function getNextImageCached(subs: Array<SubReddit> = defaultSubreddits): Promise<RedditImage | null> {
  const image = getCachedImage()
  if (image) {
    return Promise.resolve(image)
  }

  for (const sub of subs) {
    const images = await getRedditImages(sub)
    updateCachedState(prev => ({
      ...prev,
      images: {
        ...prev.images,
        [sub.name]: images
      },
      cursors: {
        ...prev.cursors,
        [sub.name]: {
          start: 0
        }
      }
    }))
  }

  return Promise.resolve(image)
}