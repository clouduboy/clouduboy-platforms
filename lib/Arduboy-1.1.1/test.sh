if [ $1 == '--help' ]; then
  echo 'Usage: ./test.sh {<example.ino> {--flash}}'
  echo
  echo 'Both parameters optional, use --flash to immediately flash after compile.'
  echo 'sources.ino is the arduino program to be compiled from sources folder.'
  echo 'If source is ommited, a default empty program will be compiled.'
  exit
fi


rm src/*
cp $1 src/test.ino

platformio run -v --disable-auto-clean

if [ $2 = '--flash' ]; then
  avrgirl-arduino flash -a arduboy -f .pioenvs/leonardo/firmware.hex
fi
