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
  refId?: String
}

export type QueueProcess<T> = (next: T) => (Promise<T> | Promise<void>)

export class HandlerQueue<T> {
  buffer: Array<T> = []
  isRunning: boolean = false
  delay: number = 200
  process: QueueProcess<T>

  constructor(process: QueueProcess<T>, delay: number = 0) {
    this.delay = delay
    this.process = process
  }

  post(next: T) {
    this.buffer.push(next)
    if (this.isRunning) return
    const first = this.buffer.shift()
    if (!first) return
    this.isRunning = true
    this.tryNext(next)
  }

  private async tryNext(current: T) {
    await this.process(current)
    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(() => resolve(0), 200))
    }
    const next = this.buffer.shift()
    if (next) {
      return await this.tryNext(next)
    } else {
      this.isRunning = false
    }
  }
}