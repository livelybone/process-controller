interface ProcessStep {
  id: string
  /**
   * Order
   *
   * 次序
   * */
  order: number
  callback<T extends any[], RT extends any>(...args: T): Promise<RT>
}
declare type StepId = ProcessStep['id']
declare type StepOrder = ProcessStep['order']
declare type StepCallback = ProcessStep['callback']

declare class ProcessController {
  /**
   * The currently running process queue
   *
   * 当前正在运行的流程队列
   * */
  static currSteps: ProcessStep[]

  /**
   * Process history generated in the whole running time
   *
   * 程序运行产生的流程历史
   * */
  static history: ProcessStep[][]

  static isRunning: boolean

  static pausing: boolean

  /**
   * The result of the previous process
   *
   * 上一个流程的处理结果
   * */
  static currResult: Promise<any>

  /**
   * Add step
   *
   * 添加流程
   * */
  static addStep(callback: StepCallback, order: StepOrder): StepId

  /**
   * Correct the order of steps
   *
   * 校正流程的顺序
   * */
  static correctOrder(): void

  /**
   * Prioritize the step with smaller order. When the process is already running, return null
   *
   * 运行，order 值越小越先执行。当流程正在运行时调用这个方法，将返回 null
   * */
  static run(): Promise<any> | null

  static pause(): void

  static stop(): void
}

export default ProcessController
