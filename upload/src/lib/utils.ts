import type { WaveformData } from "waveform-data";

export type InputFile = {
  id: string
  name: string
  file: File
  waveformData?: WaveformData
}

