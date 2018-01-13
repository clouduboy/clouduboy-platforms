if [ $1 == '--help' ]; then
  echo 'Usage: ./test.sh {<sources.ino> {--flash}}'
  echo
  echo 'Both parameters optional, use --flash to immediately flash after compile.'
  echo 'sources.ino is the arduino program to be compiled from sources folder.'
  echo 'If source is ommited, a default empty program will be compiled.'
  exit
fi

if [ -f sources/$1 ]; then
  cp sources/$1 test/src/test.ino
else
  cp sources/_default.ino test/src/test.ino
fi

platformio run -v --disable-auto-clean --project-dir test

if [ $2 = '--flash' ]; then
  avrgirl-arduino flash -a arduboy -f test/.pioenvs/leonardo/firmware.hex
fi
