#!/usr/bin/env node

const md2conf = require('.')
const fs = require('fs')
const path = require('path')
const stdin = require('get-stdin')

const filename = process.argv[2]

if (filename != null) {
  fs.readFile(path.resolve(process.cwd(), filename), (err, buf) => {
    if (err) {
      throw err
    }
    console.log(md2conf(buf + ''))
  })
} else {
  stdin().then((str) => {
    console.log(md2conf(str))
  })
}
