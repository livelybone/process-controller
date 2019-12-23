import simpleUniqueId from '@livelybone/simple-unique-id'
import { ProcessStep, StepCallback, StepId, StepOrder } from './types'

export default class ProcessController {
  /**
   * The currently running process queue
   *
   * 当前正在运行的流程队列
   * */
  static currSteps: ProcessStep[] = []

  /**
   * Process history generated in the whole running time
   *
   * 程序运行产生的流程历史
   * */
  static history: ProcessStep[][] = [[]]

  static isRunning: boolean = false

  static pausing: boolean = false

  /**
   * The result of the previous process
   *
   * 上一个流程的处理结果
   * */
  static currResult: Promise<any> = Promise.resolve()

  /**
   * Add step
   *
   * 添加流程
   * */
  static addStep(callback: StepCallback, order: StepOrder): StepId {
    const indexInsertBefore = ProcessController.currSteps.findIndex(
      (step, index) => {
        if (ProcessController.isRunning && index === 0) return false
        return step.order > order
      },
    )
    const id = simpleUniqueId()
    if (indexInsertBefore !== -1) {
      ProcessController.currSteps.splice(indexInsertBefore, 0, {
        callback,
        order,
        id,
      })
    } else {
      ProcessController.currSteps.push({ callback, order, id })
    }

    return id
  }

  /**
   * Correct the order of steps
   *
   * 校正流程的顺序
   * */
  static correctOrder() {
    ProcessController.currSteps.sort((a, b) => a.order - b.order)
  }

  /**
   * Prioritize the step with smaller order. When the process is already running, return null
   *
   * 运行，order 值越小越先执行。当流程正在运行时调用这个方法，将返回 null
   * */
  static run() {
    if (ProcessController.isRunning) return null

    ProcessController.isRunning = true
    const currHistorySteps: ProcessStep[] = ProcessController.pausing
      ? ProcessController.history[ProcessController.history.length - 1]
      : []
    if (!ProcessController.pausing)
      ProcessController.history.push(currHistorySteps)
    else ProcessController.pausing = false

    const runOne = (step: ProcessStep) => {
      ProcessController.currResult = ProcessController.currResult.then(
        (...args) => step.callback(...args),
      )
      return ProcessController.currResult.then(() => {
        currHistorySteps.push(step)

        const stepItem = ProcessController.currSteps[0]
        if (stepItem && step.id === stepItem.id) {
          ProcessController.currSteps.shift()
        }
      })
    }
    const fn = (): Promise<any> => {
      if (ProcessController.pausing || ProcessController.currSteps.length < 1) {
        return Promise.resolve()
      }
      return runOne(ProcessController.currSteps[0]).then(() => fn())
    }

    return fn().then(() => {
      ProcessController.isRunning = false
      return ProcessController.currResult
    })
  }

  static pause() {
    ProcessController.pausing = true
  }

  static stop() {
    ProcessController.currSteps = []
  }
}
