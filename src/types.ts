export interface ProcessStep {
  id: string
  /**
   * Order
   *
   * 次序
   * */
  order: number

  callback<T extends any[], RT extends any>(...args: T): Promise<RT>

  [key: string]: any
  [key: number]: any
}

export enum ProcessStatus {
  Waiting = 0,
  Running = 1,
  Pausing = 2,
}
