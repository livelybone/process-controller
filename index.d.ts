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
   * The currently running step queue
   *
   * 当前正在运行的流程的步骤队列
   * */
  currSteps: ProcessStep[]

  /**
   * Process history generated in the whole running time
   *
   * 程序运行产生的流程历史
   * */
  history: ProcessStep[][]

  isRunning: boolean

  pausing: boolean

  resolveFn: (data: any) => void

  /**
   * The result of the previous step
   *
   * 上一个步骤的处理结果
   * */
  currStepResult: Promise<any>

  /**
   * The final result of the current process
   *
   * 当前流程的最后结果
   * */
  currProcessResult: Promise<any>

  /**
   * Add step
   *
   * 添加流程
   * */
  addStep(callback: StepCallback, order: StepOrder): StepId

  /**
   * Correct the order of steps
   *
   * 校正流程的顺序
   * */
  correctOrder(): void

  /**
   * Prioritize the step with smaller order，return the final result of the current process
   *
   * 运行，order 值越小越先执行，返回当前流程的最后处理结果
   * */
  run(): Promise<any>

  pause(): void

  stop(): void
}

export default ProcessController
