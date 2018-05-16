#include <SPI.h>
#include <Gamebuino.h>

Gamebuino gb;

void setup(){
  gb.begin();
  gb.titleScreen(F("Test"));
  gb.popup(F("Let's go!"), 100);
}

void loop(){
  if(gb.update()) {
    gb.display.println(F("Hello World!"));
  }
}

