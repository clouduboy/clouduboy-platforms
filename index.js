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

// Command to start an arduino-builder compilation
function cmdArduinoBuilderCompile(env) {
  // /lib/${env.targetConfig.lib}/buildscript
  const bs = require(path.join(__dirname, '/lib', env.targetConfig.lib,'/buildscript.js'))

  env.arduinodir = '/home/flaki/.arduino15/' // TODO: load from config
  env.sourcefile = env.src

  const call = bs(env)
  return call
}



// Module
module.exports = {
  compile: (target, src, builddir) => {
    // Parameter order have been recently updated
    // We can auto-detect libraries using the old order and swap params if needed
    if (targets.get(src) && !targets.get(target)) {
      let tempsrc = src
      src = target
      target = tempsrc
    }

    let ext = path.extname(src)
    src = path.resolve(src)

    // It's a folder
    if (!ext) {
      // Use parent parent folder for compile
      src = path.dirname(src)
      console.log('src: ', src)

    // It's a file
  } else if (ext === '.ino') {
    // TODO: copy to tempdir
    console.log('src: ', src);
  } else {
    console.log('Invalid input specified: ', src)
    return
  }

  // Compile
  return execCompile(src, getEnv(target, src, builddir))
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
        src = process.argv[4],
        builddir = process.argv[5] || src&&path.dirname(src)

  // Usage
  if (cmd === 'help' || cmd === '--help') {
    console.log(
`Usage: node . {compile|help} <TARGET> <PATH_TO_SOURCE>[ <BUILD_DIR>]

help      This information
compile   Compile for source file for specified target platform.
          If PATH_TO_SOURCE is a directory, the containing directory will
          be used for compilation, otherwise it is interpreted as the Arduino
          input file source, copied to a temp directory and compiled. You can
          specify an optional BUILD_DIR which will be used by the build process.

          This command outputs the resulting binary on the standard output.
`)

  } else if (cmd === 'compile') {
    module.exports.compile(platformTarget, src, builddir)
      .then( r => console.log(r))
      .catch( e => console.error(e))

  } else {
    console.error('Unknown command: ', cmd)

  }

}


// Suggests type annotations. If no outFile specified will use a temp file.
// Returns the new Flow-enabled JS source with all inferred type annotations inline
function execCompile(src, env) {
  console.log(env)
  return prepareTargetDir(env.builddir, env)
    .then(_ => {
      switch (env.toolchain) {
        case 'arduino_builder':
          return execa.shell(cmdArduinoBuilderCompile(env))
        default:
          return execa.shell(cmdPioCompile(src))
      }
    })
    .then(result => {
      let ret = {
        stdout: result.stdout,
        stderr: result.stderr
      }

      let binaries = []

      if (env.resultHex) binaries.push(
        fs.readFile(env.resultHex).then(buf => ret.hex = buf.toString())
      )

      if (env.resultBin) binaries.push(
        fs.readFile(env.resultBin).then(buf => ret.bin = buf.toJSON().data)
      )

      return Promise.all(binaries).then(_ => ret)
    })
}


// Prepare target dir for compilation
// - Symlink for `lib`
// - Symlink `platformio.ini` (or copy/generate)
// - TODO: figure out how to avoid std lib recompiles (.pioenvs/*)
// - `src` folder with `ino` should already exist
// - Run `platformio run`
function prepareTargetDir(dir, env) {
  let prep = []

  // All toolchains
  prep.push(fs.ensureSymlink(path.join(__dirname, 'lib', env.targetConfig.lib, 'lib'), path.join(dir, 'lib')))

  // platformio ini file
  if (env.toolchain === 'platformio') {
    prep.push(fs.ensureSymlink(path.join(__dirname, 'lib', env.targetConfig.lib, 'platformio.ini'), path.join(dir, 'platformio.ini')))
  }

  // arduino-builder build directory
  if (env.toolchain === 'arduino_builder') {
    fs.ensureDir(path.join(dir, 'build'))
  }

  return Promise.all(prep)
}


// Create compile environment descriptor
function getEnv(target, src, builddir) {
  const env = { src }

  // Absolute path
  env.builddir = path.resolve(builddir)

  // Current target & associated configuration
  env.target = target
  env.targetConfig = targets.get(target)

  // Detect compiler toolchain
  // TODO: auto-detect
  env.toolchain = 'platformio'
  env.toolchain = 'arduino_builder'

  // Use toolchain config of the current target
  env.toolchainConfig = env.targetConfig.toolchain[env.toolchain]

  // Process compile result paths
  if (env.toolchainConfig.binpath) {
    env.resultBin = path.resolve(
      env.builddir,
      env.toolchainConfig.binpath
        .replace(/%SRC_FILENAME%/g, path.basename(src))
    )
  }

  if (env.toolchainConfig.hexpath) {
    env.resultHex = path.resolve(
      env.builddir,
      env.toolchainConfig.hexpath
        .replace(/%SRC_FILENAME%/g, path.basename(src))
    )
  }

  return env
}
