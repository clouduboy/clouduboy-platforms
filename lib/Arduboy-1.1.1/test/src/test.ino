#include <SPI.h>
#include "Arduboy.h"

#include <EEPROM.h>
#include <avr/pgmspace.h>

Arduboy arduboy;

void setup() {
  arduboy.begin();
}


void loop() {
  arduboy.display();
}
