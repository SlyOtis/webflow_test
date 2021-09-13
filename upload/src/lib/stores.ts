import {writable} from 'svelte/store'
import type {InputFile} from "./utils";

export const fileStore = writable<{[key: string]: InputFile}>()

export default fileStore