#include <TinyScreen.h>
#include <SPI.h>
#include <Wire.h>

#include <TinyArcade.h>

TinyScreen display = TinyScreen(TinyScreenPlus);


void setup() {
  arcadeInit();
  Wire.begin();

  display.begin();
  display.setFlip(0);
  display.setBrightness(8);
  display.setBitDepth(1);
}


void loop() {

}
