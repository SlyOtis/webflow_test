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
  protected buffer: Array<T> = []
  protected _isRunning: boolean = false
  protected process: QueueProcess<T>
  protected kill: boolean = false

  delay: number = 200

  constructor(process: QueueProcess<T>, delay: number = 0) {
    this.delay = delay
    this.process = process
  }

  get isAlive(): boolean {
    return !this.kill
  }

  get isRunning(): boolean {
    return this._isRunning
  }

  post(next: T) {
    this.buffer.push(next)
    if (this._isRunning) return
    const first = this.buffer.shift()
    if (!first) return
    this._isRunning = true
    this.tryNext(next)
  }

  private async tryNext(current: T) {
    if (this.kill) return
    await this.process(current)

    if (this.delay > 0) {
      await new Promise(resolve => setTimeout(() => resolve(0), 200))
    }

    const next = this.buffer.shift()
    if (next) {
      return await this.tryNext(next)
    } else {
      this._isRunning = false
    }
  }

  /**
   * Joins to the main thread by completing the ongoing process and then completing
   */
  join(clearQueue: boolean = true) {
    this.kill = true
    if (clearQueue) this.buffer = []
  }
}