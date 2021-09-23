import type { WaveformData } from "waveform-data";

export type ProgressInfo = FileProgressInfo & {
  total: number
  index: number
}

export type FileProgressInfo = {
  progress: number
}

export type InputFile = {
  id: string
  name: string
  file: File
  data?: WaveformData
  upload?: FileProgressInfo
  processing?: FileProgressInfo
  audioUrl?: String
  waveUrl?: String
}

