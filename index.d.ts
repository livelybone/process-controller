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
   * Run
   *
   * 运行
   * */
  static run(): Promise<any>

  static pause(): void

  static stop(): void
}

export default ProcessController
