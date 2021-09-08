import type { WaveformData } from "waveform-data";

export type InputFileLoading = {
  message?: string
  progress?: number
  createdAt: Date

}

export type InputFile = {
  id: string
  name: string
  file: File
  waveformData?: WaveformData
  loading?: Array<InputFileLoading>
}

