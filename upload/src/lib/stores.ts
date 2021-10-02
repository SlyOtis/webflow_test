import {writable} from 'svelte/store'
import type {InputFile} from "./utils";
import {
  ref,
  set,
  get,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from 'firebase/database'
import {database} from "./firebase";

export type FileStore = {[key: string]: InputFile}
export const fileStore = writable<FileStore>({})
const filesRef = ref(database, 'files')

//
// onChildAdded(fileRef, (data) => {
//   fileStore.update(exist => {
//
//     const {
//       createdAt,
//       ...rest
//     } = data.val()
//
//     return {
//       ...exist,
//       [data.key]: {
//         ...exist[data.key],
//         ...rest,
//         createdAt: parseISO(createdAt)
//       }
//     }
//   })
// })
//
// onChildChanged(fileRef, (data) => {
//   fileStore.update(exist => {
//     const {
//       createdAt,
//       ...rest
//     } = data.val()
//
//     return {
//       ...exist,
//       [data.key]: {
//         ...exist[data.key],
//         ...rest
//       }
//     }
//   })
// })
//
// onChildRemoved(fileRef, (data) => {
//   fileStore.update(exist => {
//     delete exist[data.key]
//     return exist
//   })
// })

export async function updateFileInput(inn: InputFile) {
  const fileRef = ref(database, 'files/' + inn.id)

  const {
    file,
    processing,
    upload,
    data,
    svgEl,
    createdAt,
    ...rest
  } = inn

  await set(fileRef, {
    ...rest,
    createdAt: createdAt.toISOString()
  })

  return fileRef
}

export async function setAssociation(inn: InputFile) {
  const fileRef = ref(database, 'slugs/' + inn.slug)

  const existing = await get(fileRef).then(res => res.exists() ? res.val() : null)

  await set(fileRef, {
    fileIds: [
        ...existing ? existing?.fileIds : [],
      inn.id
    ],
    createdAt: existing?.createdAt || (new Date()).toISOString(),
    updatedAt: (new Date()).toISOString()
  })

  return fileRef
}

//TODO:: This should validate hashes at both ends

export default fileStore
