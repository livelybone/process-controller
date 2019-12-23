import simpleUniqueId from '@livelybone/simple-unique-id'
import { ProcessStep, StepCallback, StepId, StepOrder } from './types'

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
  history: ProcessStep[][] = [[]]

  isRunning: boolean = false

  pausing: boolean = false

  resolveFn!: (data: any) => void

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

  /**
   * Add step
   *
   * 添加流程
   * */
  addStep(callback: StepCallback, order: StepOrder): StepId {
    const indexInsertBefore = this.currSteps.findIndex((step, index) => {
      if (this.isRunning && index === 0) return false
      return step.order > order
    })
    const id = simpleUniqueId()
    if (indexInsertBefore !== -1) {
      this.currSteps.splice(indexInsertBefore, 0, {
        callback,
        order,
        id,
      })
    } else {
      this.currSteps.push({ callback, order, id })
    }

    return id
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
   * Prioritize the step with smaller order，return the final result of the current process
   *
   * 运行，order 值越小越先执行，返回当前流程的最后处理结果
   * */
  run() {
    if (this.isRunning || this.currSteps.length < 1) {
      return this.currProcessResult!
    }

    this.currProcessResult = new Promise(res => {
      this.resolveFn = res
    })
    this.isRunning = true
    const currHistorySteps: ProcessStep[] = this.pausing
      ? this.history[this.history.length - 1]
      : []
    if (!this.pausing) {
      this.history.push(currHistorySteps)
    } else this.pausing = false

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
        if (this.currSteps.length < 1) this.resolveFn(data)
      })
    }
    const fn = (): Promise<any> => {
      if (this.pausing || this.currSteps.length < 1) {
        return Promise.resolve()
      }
      return runOne(this.currSteps[0]).then(() => fn())
    }

    return fn().then(() => {
      this.isRunning = false
      return this.currProcessResult
    })
  }

  pause() {
    this.pausing = true
  }

  stop() {
    this.currSteps = []
  }
}
