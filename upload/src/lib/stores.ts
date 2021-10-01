import {writable} from 'svelte/store'
import type {InputFile} from "./utils";
import {
  ref,
  set,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from 'firebase/database'
import {database} from "./firebase";

export const fileStore = writable<{[key: string]: InputFile}>({})
const fileRef = ref(database, 'files')

onChildAdded(fileRef, (data) => {
  fileStore.update(exist => ({
    ...exist,
    [data.key]: data.val()
  }))
})

onChildChanged(fileRef, (data) => {
  fileStore.update(exist => ({
    ...exist,
    [data.key]: data.val()
  }))
})

onChildRemoved(fileRef, (data) => {
  fileStore.update(exist => {
    delete exist[data.key]
    return exist
  })
})

export async function updateFileInput(inn: InputFile) {
  const fileRef = ref(database, 'files/' + inn.id)

  const {
    file,
    processing,
    upload,
    waveUrl, //TODO:: Already depricated ?
    ...rest
  } = inn

  await set(fileRef, rest)

  return fileRef
}

//TODO:: This should validate hashes at both ends

export default fileStore
