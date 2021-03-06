# process-controller
[![NPM Version](http://img.shields.io/npm/v/process-controller.svg?style=flat-square)](https://www.npmjs.com/package/process-controller)
[![Download Month](http://img.shields.io/npm/dm/process-controller.svg?style=flat-square)](https://www.npmjs.com/package/process-controller)
![gzip with dependencies: 2kb](https://img.shields.io/badge/gzip--with--dependencies-2kb-brightgreen.svg "gzip with dependencies: 2kb")
![typescript](https://img.shields.io/badge/typescript-supported-blue.svg "typescript")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")

> `pkg.module supported`, 天然支持 tree-shaking, 使用 es module 引用即可

[English Document](./README.md)

A process controller base on promise that can be used in both browser and node

## repository
git@github.com:livelybone/process-controller.git

## Demo
https://github.com:livelybone/process-controller#readme

## Run Example
你可以通过运行项目的 example 来了解这个组件的使用，以下是启动步骤：

1. 克隆项目到本地 `git clone git@github.com:livelybone/process-controller.git`
2. 进入本地克隆目录 `cd your-module-directory`
3. 安装项目依赖 `npm i`(使用 taobao 源: `npm i --registry=http://registry.npm.taobao.org`)
4. 启动服务 `npm run dev`
5. 在你的浏览器看 example (地址通常是 `http://127.0.0.1:3000/examples/test.html`)

## Installation
```bash
npm i -S process-controller
```

## Global name - The variable the module exported in `umd` bundle
`ProcessController`

## Interface
去 [index.d.ts](./index.d.ts) 查看可用方法和参数

## Usage
```js
import ProcessController from 'process-controller'

// Simple example: Auto run
// modal1 will show after modal2 clicked to confirm
const controller = new ProcessController({ autoRun: () => true })

controller.addStep(() => {
  return new Promise((res, rej) => {
    // modal1
    ConfirmModal.open({
      content: 'some content of the confirm modal1',
      onConfirm: () => res(),
      onReject: () => rej(),
    })
  })
}, 2)

controller.addStep(() => {
  return new Promise((res, rej) => {
    // modal2
    ConfirmModal.open({
      content: 'some content of the confirm modal2',
      onConfirm: () => res(),
      onReject: () => rej(),
    })
  })
}, 1)
```

在 HTML 文件中直接引用，你可以在 [CDN: unpkg](https://unpkg.com/process-controller/lib/umd/) 看到你能用到的所有 js 脚本
```html
<-- 然后使用你需要的 -->
<script src="https://unpkg.com/process-controller/lib/umd/<--module-->.js"></script>
```
