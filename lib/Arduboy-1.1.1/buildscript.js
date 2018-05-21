/// arduinodir = '/opt/arduino-1.8.5'
/// builddir = '/home/apps/data/arduboy/build'
/// sourcefile = '/home/apps/data/arduboy/test/test.ino'

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
    -fqbn=arduboy:avr:arduboy \
    -ide-version=10805 \
    -build-path ${env.builddir} \
    -warnings=none \
    -prefs=build.warn_data_percentage=75 \
    -prefs=runtime.tools.avrdude.path=${env.arduinodir}/packages/arduino/tools/avrdude/6.3.0-arduino9 \
    -prefs=runtime.tools.avr-gcc.path=${env.arduinodir}/packages/arduino/tools/avr-gcc/4.9.2-atmel3.5.4-arduino2 \
    -prefs=runtime.tools.arduinoOTA.path=${env.arduinodir}/packages/arduino/tools/arduinoOTA/1.1.1 \
    -prefs=tools.ctags.path=/usr/bin \
    -prefs=tools.ctags.cmd.path={path}/arduino-ctags \
    -prefs=tools.ctags.pattern=\\"{cmd.path}\\"\\ -u\\ --language-force=c++\\ -f\\ -\\ --c++-kinds=svpf\\ --fields=KSTtzns\\ --line-directives\\ \\"{source_file}\\" \
    -verbose \
    ${env.sourcefile}
  `.replace(/\s+/g,' ').trim()
}
