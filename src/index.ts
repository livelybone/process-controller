import simpleUniqueId from '@livelybone/simple-unique-id'
import { ProcessStatus, ProcessStep } from './types'

export * from './types'

export interface ProcessControllerOptions {
  autoRun?(
    step: ProcessStep,
    ctx: ProcessController,
  ): Promise<boolean> | boolean
}

export default class ProcessController {
  /**
   * The currently running step queue
   *
   * 当前正在运行的流程的步骤队列
   * */
  currSteps: ProcessStep[] = []

  /**
   * Process history generated in the whole running time
   *
   * 程序运行产生的流程历史
   * */
  history: ProcessStep[][] = []

  status: ProcessStatus = ProcessStatus.Waiting

  /**
   * The result of the previous step
   *
   * 上一个步骤的处理结果
   * */
  currStepResult: Promise<any> = Promise.resolve()

  /**
   * The final result of the current process
   *
   * 当前流程的最后结果
   * */
  currProcessResult: Promise<any> = Promise.resolve()

  options!: Required<ProcessControllerOptions>

  constructor(options?: ProcessControllerOptions) {
    this.options = {
      ...options,
      autoRun: (options && options.autoRun) || (() => false),
    }
  }

  /**
   * Correct the order of steps
   *
   * 校正流程的顺序
   * */
  correctOrder() {
    this.currSteps.sort((a, b) => a.order - b.order)
  }

  /**
   * Add step
   *
   * 添加流程
   * */
  addStep(
    callback: ProcessStep['callback'],
    order: ProcessStep['order'],
    extraInfo?: { [key in string | number]: any },
  ): ProcessStep {
    const id = simpleUniqueId()
    const step = { ...extraInfo, callback, order, id }
    this.currSteps.push(step)
    this.correctOrder()

    Promise.resolve(this.options.autoRun(step, this)).then(run => {
      if (run) this.run()
    })

    return step
  }

  /**
   * Prioritize the step with smaller order，return the final result of the current process
   *
   * 运行，order 值越小越先执行，返回当前流程的最后处理结果
   * */
  run() {
    if (this.status === ProcessStatus.Running || this.currSteps.length < 1) {
      return this.currProcessResult!
    }

    if (this.status !== ProcessStatus.Pausing) {
      this.history.push([])
      let resolveFn: any
      this.currProcessResult = new Promise(res => {
        resolveFn = res
      })
      ;(this.currProcessResult as any).resolveFn = resolveFn
    }
    const currHistorySteps = this.history[this.history.length - 1]

    const runOne = (step: ProcessStep) => {
      this.currStepResult = this.currStepResult.then((...args) =>
        step.callback(...args),
      )
      return this.currStepResult.then(data => {
        currHistorySteps.push(step)

        const stepItem = this.currSteps[0]
        if (stepItem && step.id === stepItem.id) {
          this.currSteps.shift()
        }
        if (this.currSteps.length < 1)
          (this.currProcessResult as any).resolveFn(data)
      })
    }
    const fn = (): Promise<any> => {
      if (this.status === ProcessStatus.Pausing || this.currSteps.length < 1) {
        return Promise.resolve()
      }
      return runOne(this.currSteps[0]).then(() => fn())
    }

    this.status = ProcessStatus.Running
    return fn().then(() => {
      this.status = ProcessStatus.Waiting
      return this.currProcessResult
    })
  }

  pause() {
    this.status = ProcessStatus.Pausing
  }

  stop() {
    this.currSteps = []
    this.status = ProcessStatus.Waiting
  }
}
