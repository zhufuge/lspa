#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

// For record 'Not Found' error infomation
const stack = []

function find(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    const absolute = path.resolve(filePath)
    stack.push(absolute)

    if (err) {
      const { root, dir } = path.parse(absolute)
      if (err.code === 'ENOENT' && root !== dir) {
        find(path.join('..', filePath))
      } else {
        notFound()
      }
    } else {
      const { scripts, name, version } = JSON.parse(data)
      const meta = name && version
            ? setColor(name + '@' + version, 2)
            : (setColor('Warning', 3) + ': ' +
               setColor(absolute, 7) +  ' isn\'t a complete package.json .')

      if (scripts) {
        console.log(meta, setColor('scripts', 7))
        for (let script in scripts) {
          console.log(`   ${setColor(script, 3)}: ${scripts[script]}`)
        }
      } else {
        console.log(meta)
        console.log(`${setColor('Warning', 3)}: no scripts in the package.`)
      }
    }
  })
}

function notFound() {
  console.log(
    stack
      .map(p => setColor('Not Found:', 3) + ' ' + setColor(p, 7))
      .join('\n')
  )
  console.log(setColor('Error: Didn\'t find any project', 1))
}

function setColor(string, color=3) {
  return `\u001b[3${color};1m${string}\u001b[0m`
}

find('.\\package.json')
