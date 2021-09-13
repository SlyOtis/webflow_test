import random from 'random'
import eachMinuteOfInterval from 'date-fns/eachMinuteOfInterval'
import {writable} from 'svelte/store'
import {get_store_value} from "svelte/internal";

type RedditImage = {
  url: string
} & ImageResolution

type RedditPreviewImage = {
  id: string
  title: string
  resolutions?: Array<RedditImage>
  source?: RedditImage
  url?: string
}

type RedditPostPreview = {
  enabled: boolean
  images: Array<RedditPreviewImage>
}

type RedditPost = {
  id: string
  title: string
  post_hint?: 'image' | any
  preview?: RedditPostPreview
  url?: string
  url_overridden_by_dest?: string
}

export type SubReddit = {
  name: string
  r: string
  flair?: string
  sort?: 'hot' | 'new' | 'top' | 'rising'
  updatedAt?: Date
}

export type SubRedditDict = {[r: string]: SubReddit}

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

export type RedditCacheCursor = {
  start: number
}

export type RedditCursorIndex = {
  key: string
  index: number
}

export type RedditCache = {
  currentCursor?: RedditCursorIndex
  updatedAt?: Date
  subreddits: SubRedditDict
  cursors: {
    [key: string]: RedditCacheCursor
  },
  images: {
    [key: string]: Array<RedditImage>
  }
}

const redditStore = writable<RedditCache | null>(getCachedState())

redditStore.subscribe(value => {
  localStorage.setItem('reddit_images', JSON.stringify(value))
})


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

export function getRedditApiUrl(sub: SubReddit) {
  return `${state.baseUrl}/r/${sub.r}` + (
    sub.sort ? `/${sub.sort}/` : ''
  ) + '.json' + (
    sub.flair ? '?f=' + encodeURI(`flair_name:"${sub.flair}"`) : ''
  )
}

function getValidUrl(post: RedditPost): string | null {
  const url = post.url || post.url_overridden_by_dest //TODO:: Improve type handling
  if (
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.webm') ||
    url.endsWith('.png') ||
    url.endsWith('.mp4')
  ) {//TODO:: Fix supported formats
    return url
  }
  return null
}

function extractPreviewImages(prev: Array<RedditPreviewImage>, curr: { data: RedditPost }): Array<RedditPreviewImage> {
  if ('data' in curr) {
    if (curr.data.post_hint === 'image' && 'preview' in curr.data) {
      if (curr.data.preview.enabled && 'images' in curr.data.preview && Array.isArray(curr.data.preview.images)) {
        if (curr.data.preview.images.length > 0) { //TODO:: fix this ?
          const image = curr.data.preview.images[0]
          const url = getValidUrl(curr.data)
          if (image && url) {
            return [
              ...prev,
              {
                id: image.id,
                title: curr.data.title,
                resolutions: image.resolutions,
                source: image.source,
                url
              }
            ] //TODO:: Determine which one of these to return.
          }
        }
      }
    } else {
      const url = getValidUrl(curr.data)
      if (url) {
        return [
          ...prev,
          {
            id: curr.data.id,
            title: curr.data.title,
            url
          }
        ]
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

const defaultSubreddits: { [r: string]: SubReddit } = {
  'wallpapers': {
    name: 'Wallpapers',
    r: 'wallpapers',
    sort: 'hot'
  }
  ,
  'edm': {
    name: 'EDM',
    r: 'EDM',
    flair: 'Photo',
    sort: 'hot'
  },
  'Offensive_Wallpapers': {
    name: 'Offencive Wallpapers',
    r: 'Offensive_Wallpapers',
    sort: 'hot'
  }
  ,
// {
//   name: 'feetandbbc',
//   r: 'feetandbbc',
//   sort: 'hot'
// },
  'trippy': {
    name: 'Trippy',
    r: 'trippy',
    sort: 'hot'
  },
  'DrugArt': {
    name: 'DrugArt',
    r: 'DrugArt',
    sort: 'hot'
  },
  'multiwall': {
    name: 'Multiwall',
    r: 'multiwall',
    sort: 'hot'
  }
}


export const getImages = (sub: SubReddit = defaultSubreddits[0]): Promise<Array<RedditPreviewImage>> => fetch(getRedditApiUrl(sub), {
  method: 'GET',
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


function resetCursorIndex(cache: RedditCache): RedditCursorIndex {
  const keys = Object.keys(cache.cursors)
  cache.currentCursor = {
    key: keys[0],
    index: 0
  }

  return cache.currentCursor
}

async function getRandomCachedImage(currentCursor: RedditCursorIndex = null): Promise<RedditImage | null> {
  const cache = getCachedState()

  if (cache) {

    if (cache.updatedAt) {
      const min = eachMinuteOfInterval({start: cache.updatedAt, end: new Date()},)
      console.log(min)
    } else {
      return null
    }

    let {
      key,
      index
    } = currentCursor || cache.currentCursor || resetCursorIndex(cache)

    const images = cache.images[key]
    const cursor = cache.cursors[key]

    const keys = Object.keys(cache.cursors)
    index = random.int(0, keys.length - 1)

    cache.cursors[key] = {
      ...cursor,
      start: random.int(0, images.length - 1)
    }

    cache.currentCursor = {
      key: keys[index],
      index
    }

    redditStore.set(cache)

    return images[cursor.start]
  }

  return null
}


function shouldRefetch(cache: RedditCache) {
  return
}

function getNextCachedImage(currentCursor: RedditCursorIndex = null): RedditImage | null {
  const cache = getCachedState()
  if (cache) {

    let {
      key,
      index
    } = currentCursor || cache.currentCursor || resetCursorIndex(cache)

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

      redditStore.set(cache)
      return getNextCachedImage()
    }

    cursor.start++
    cache.cursors[key] = cursor
    redditStore.set(cache)

    return images[cursor.start]
  }

  return null
}

export async function getNextImageCached(subs: SubRedditDict = defaultSubreddits): Promise<RedditImage | null> {
  const image = getNextCachedImage()
  if (image) {
    return Promise.resolve(image)
  }

  for (const r of Object.keys(subs)) {
    const sub = subs[r]
    const images = await getRedditImages(sub)
    redditStore.update(prev => ({
      ...prev,
      subreddits: {
        ...subs,
        [r]: {
          ...sub,
          updatedAt: new Date()
        }
      },
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

async function fetchImagesForSubs(subs: SubRedditDict) {
  for (const r of Object.keys(subs)) {
    const sub = subs[r]
    const images = await getRedditImages(sub)
    redditStore.update(prev => ({
      ...prev,
      updatedAt: new Date(),
      subreddits: {
        ...subs,
        [r]: {
          ...sub,
          updatedAt: new Date()
        }
      },
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

}

export async function getRandomImageCached(subs: SubRedditDict = defaultSubreddits): Promise<RedditImage | null> {
  const image = getRandomCachedImage()
  if (image) {
    return Promise.resolve(image)
  }

  fetchImagesForSubs(subs)

  return getRandomCachedImage()
}
