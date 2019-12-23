export interface ProcessStep {
  id: string
  /**
   * Order
   *
   * 次序
   * */
  order: number

  callback<T extends any[], RT extends any>(...args: T): Promise<RT>
}

export type StepId = ProcessStep['id']
export type StepOrder = ProcessStep['order']

export type StepCallback = ProcessStep['callback']
