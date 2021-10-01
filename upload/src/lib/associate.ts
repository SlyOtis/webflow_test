import { writable} from "svelte/store";
import type {Readable} from 'svelte/store'
import type {InputFile} from "./utils";

const _editFile = writable<InputFile>(null)

export function setEditFile(inn: InputFile) {
  _editFile.set(inn)
}

export function clearEditFile() {
  _editFile.set(null)
}

export const editFile: Readable<InputFile> = _editFile