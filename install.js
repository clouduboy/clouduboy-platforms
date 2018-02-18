const sources = [
  {
    lib: 'Arduboy-1.1.1',
    target: 'arduboy',
    tarballs: [ 'https://github.com/Arduboy/Arduboy/tarball/1.1.1' ]
  }
]

const fs = require('fs-extra')
const fetch = require('node-fetch')
const tar = require('tar')


// Fetch all
sources.forEach(src => {
  console.log(`Installing ${src.lib} library...`)

  let tgzPromises = src.tarballs.map((tarball, n) => {
    console.log(`Processing ${tarball} ...`)
    return fetch(tarball).then(res => {
      console.log(` - downloading ...`)
      const tgzFile = `data/${src.target}-${n}.tgz`
      const dest = fs.createWriteStream(tgzFile)


      return new Promise(resolve => {
        res.body.on('end', _ => {
          console.log(' - downloaded')
          resolve(tgzFile)
        })
        res.body.pipe(dest)
      })
    }).then(tgz => {
      console.log(`Extracting ${tgz} ...`)

      const targetLibDir = `lib/${src.lib}/lib/${src.target}-${n}`
      const untar = fs.createReadStream(tgz)

      return new Promise(resolve => {
        untar.on('end', _ => resolve(targetLibDir))

        fs.ensureDirSync(targetLibDir)

        untar.pipe(
          tar.extract({ cwd: targetLibDir, strip: 1 })
        )
      })
    }).catch(e => console.log(e))

  Promise.all(tgzPromises).then(res => {
    console.log('Done')
    console.log(res.join('\n'))
  })

  })
})
