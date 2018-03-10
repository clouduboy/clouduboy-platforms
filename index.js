"use strict"

const fs = require('fs-extra')
const path = require('path')

const execa = require('execa')


// Load targets
const targets = require('./targets.json').reduce(
  (map, t) => (map, map.set(t.target, t)),
  new Map()
)


// TODO: `which pio` check to make sure platformio is installed
const PIO_BIN = '/usr/bin/pio'



// Command to start a platformio compilation
function cmdPioCompile(projectDir) { return `${PIO_BIN} run --disable-auto-clean -d ${projectDir}` }



// Module
module.exports = {
  compile: (src, target) => {
    let ext = path.extname(src)

    // It's a folder
    if (!ext) {
      // Use parent parent folder for compile
      src = path.dirname(src)
      console.log('src: ', src)

    // It's a file
  } else if (ext === 'ino') {
    // TODO: copy to tempdir
    console.log(src);
  } else {
    console.log('Invalid input specified: ', src)
    return
  }

  // Compile
  return pioCompile(src, target)
    .then( r => {
      return r
    })

    // Catch any errors & clean up
    .catch(e => {
      throw e
    })
  }
}


// CLI
if (!module.parent) {
  const cmd = process.argv[2] || 'help',
        platformTarget = process.argv[3],
        src = process.argv[4]

  // Usage
  if (cmd === 'help' || cmd === '--help') {
    console.log(
`Usage: node . {compile|help} <TARGET> <PATH_TO_SOURCE>

help      This information
compile   Compile for source file for specified target platform.
          If PATH_TO_SOURCE is a directory, the containing directory will
          be used for compilation, otherwise it is interpreted as the Arduino
          input file source, copied to a temp directory and compiled.

          This command outputs the resulting HEX binary on the standard output.
`)

  } else if (cmd === 'compile') {
    module.exports.compile(src, platformTarget)
      .then( r => console.log(r))
      .catch( e => console.error(e))

  } else {
    console.error('Unknown command: ', cmd)

  }

}


// Suggests type annotations. If no outFile specified will use a temp file.
// Returns the new Flow-enabled JS source with all inferred type annotations inline
function pioCompile(src, target) {
  const t = targets.get(target)

  return prepareTargetDir(src, target)
    .then(
      _ => execa.shell(cmdPioCompile(src))
    )
    .then(result => {
      return fs.readFile(path.join(src, t.binpath)).then(buf => {
        return ({
          hex: buf.toString(),
          stdout: result.stdout,
          stderr: result.stderr
        })
      })
    })
}


// Prepare target dir for compilation
// - Symlink for `lib`
// - Symlink `platformio.ini` (or copy/generate)
// - TODO: figure out how to avoid std lib recompiles (.pioenvs/*)
// - `src` folder with `ino` should already exist
// - Run `platformio run`
function prepareTargetDir(dir, target) {
  const t = targets.get(target)

  return Promise.all([
    fs.ensureSymlink(path.join(__dirname, 'lib', t.lib, 'lib'), path.join(dir, 'lib')),
    fs.ensureSymlink(path.join(__dirname, 'lib', t.lib, 'platformio.ini'), path.join(dir, 'platformio.ini')),
  ])
}
