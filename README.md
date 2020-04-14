# process-controller
[![NPM Version](http://img.shields.io/npm/v/process-controller.svg?style=flat-square)](https://www.npmjs.com/package/process-controller)
[![Download Month](http://img.shields.io/npm/dm/process-controller.svg?style=flat-square)](https://www.npmjs.com/package/process-controller)
![gzip with dependencies: kb](https://img.shields.io/badge/gzip--with--dependencies-kb-brightgreen.svg "gzip with dependencies: kb")
![typescript](https://img.shields.io/badge/typescript-supported-blue.svg "typescript")
![pkg.module](https://img.shields.io/badge/pkg.module-supported-blue.svg "pkg.module")

> `pkg.module supported`, which means that you can apply tree-shaking in you project

[中文文档](./README-CN.md)

A process controller base on promise that can be used in both browser and node

## repository
git@github.com:livelybone/process-controller.git

## Demo
https://github.com:livelybone/process-controller#readme

## Run Example
Your can see the usage by run the example of the module, here is the step:

1. Clone the library `git clone git@github.com:livelybone/process-controller.git`
2. Go to the directory `cd your-module-directory`
3. Install npm dependencies `npm i`(use taobao registry: `npm i --registry=http://registry.npm.taobao.org`)
4. Open service `npm run dev`
5. See the example(usually is `http://127.0.0.1/examples/test.html`) in your browser

## Installation
```bash
npm i -S process-controller
```

## Global name - The variable the module exported in `umd` bundle
`ProcessController`

## Interface
See what method or params you can use in [index.d.ts](./index.d.ts)

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

Use in html, see what your can use in [CDN: unpkg](https://unpkg.com/process-controller/lib/umd/)
```html
<-- use what you want -->
<script src="https://unpkg.com/process-controller/lib/umd/<--module-->.js"></script>
```
