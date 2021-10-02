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
  createdAt: Date
  file: File
  data?: WaveformData
  upload?: FileProgressInfo
  processing?: FileProgressInfo
  svgEl?: SVGElement
  audioUrl?: String
  waveUrl?: String
  slug?: String
}

export type QueueProcess<T> = (next: T) => (Promise<T> | Promise<void>)

export class HandlerQueue<T> {
  protected buffer: Array<T> = []
  protected running: number = 0
  protected process: QueueProcess<T>
  protected kill: boolean = false
  protected inParallel: number = 1

  delay: number = 200

  constructor(process: QueueProcess<T>, delay: number = 0, inParallel: number = 1) {
    this.delay = delay
    this.process = process
    this.inParallel = inParallel
  }

  isAlive(): boolean {
    return !this.kill
  }

  isRunning(): boolean {
    return this.running > 0
  }

  /**
   * Posts the next item at the back of the queue
   * @param next T the next value to process
   */
  post(next: T) {
    this.buffer.push(next)
    if (this.running >= this.inParallel) return
    const first = this.buffer.shift()
    if (!first) return
    this.running++
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
      this.running--
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