#include <TinyScreen.h>
#include <SPI.h>
#include <Wire.h>

#include <TinyArcade.h>

TinyScreen _display = TinyScreen(TinyScreenPlus);


void setup() {
  arcadeInit();
  Wire.begin();

  _display.begin();
  _display.setFlip(0);
  _display.setBrightness(8);
  _display.setBitDepth(1);
}


void loop() {

}
