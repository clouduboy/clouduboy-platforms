/// arduinodir = '/opt/arduino-1.8.5'
/// builddir = '/home/apps/data/tinyarcade/build'
/// sourcefile = '/home/apps/data/tinyarcade/test/test.ino'

module.exports = (env) => {
  return `
    arduino-builder \
    -compile \
    -logger=machine \
    -hardware ${env.arduinodir}/hardware \
    -hardware ${env.arduinodir}/packages \
    -tools ${env.arduinodir}/tools \
    -tools ${env.arduinodir}/packages \
    -libraries ${env.targetConfig.libpath}/lib/ \
    -fqbn=TinyCircuits:samd:tinyarcade:BuildOption=TAgame \
    -ide-version=10805 \
    -build-path ${env.builddir} \
    -warnings=none \
    -prefs=runtime.tools.openocd.path=${env.arduinodir}/packages/arduino/tools/openocd/0.9.0-arduino \
    -prefs=runtime.tools.bossac.path=${env.arduinodir}/packages/arduino/tools/bossac/1.6.1-arduino \
    -prefs=runtime.tools.CMSIS.path=${env.arduinodir}/packages/arduino/tools/CMSIS/4.0.0-atmel \
    -prefs=runtime.tools.arm-none-eabi-gcc.path=/usr \
    -prefs=tools.ctags.path=/usr/bin \
    -prefs=tools.ctags.cmd.path={path}/arduino-ctags \
    -prefs=tools.ctags.pattern=\\"{cmd.path}\\"\\ -u\\ --language-force=c++\\ -f\\ -\\ --c++-kinds=svpf\\ --fields=KSTtzns\\ --line-directives\\ \\"{source_file}\\" \
    -verbose \
    ${env.sourcefile}
  `.replace(/\s+/g,' ').trim()
}
