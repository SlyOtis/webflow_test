import {writable} from 'svelte/store'
import type {InputFile} from "./utils";
import {} from './firebase'

export const fileStore = writable<{[key: string]: InputFile}>({})

export default fileStore