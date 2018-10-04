#!/usr/bin/env node

const md2conflu = require('.')
const fs = require('fs')
const path = require('path')
const stdin = require('get-stdin')

const filename = process.argv[2]

if (filename != null) {
  fs.readFile(path.resolve(process.cwd(), filename), (err, buf) => {
    console.log(md2conflu(buf + ''))
  })
} else {
  stdin().then((str) => {
    console.log(md2conflu(str))
  })
}
