#include "MicroBit.h"

//MicroBit uBit;


SPI spi(MICROBIT_PIN_P15, NC, MICROBIT_PIN_P13); // mosi, miso (dummy), sclk

DigitalOut _cmd(MICROBIT_PIN_P16); // command pin
DigitalOut _rst(MICROBIT_PIN_P14); // reset pin

const char INITCOMMAND[] = {
0xAE, 0xA4, 0xD5, 0xF0, 0xA8, 0x3F, 0xD3, 0x00, 0x00, 0x8D, 0x14, 0x20, 0x00, 0x21, 0x00, 0x7F, 0x22, 0x00, 0x3F, 0xa1, 0xc8, 0xDA, 0x12, 0x81, 0xCF, 0xd9, 0xF1, 0xDB, 0x40, 0xA6, 0xd6, 0x00, 0xaf};
const unsigned int INITCOMMAND_LENGTH = 33;

char TXBUF[128];

char SCREEN[1024];

const uint8_t avatar[] = {
    /*20x8*/ 0x81, 0x4f, 0x6e, 0x7c, 0x38, 0x3c, 0x3e, 0x3a, 0x1a, 0x18, 0x1c, 0x1c, 0x1a, 0x1a, 0x1a, 0x0c, 0x0c, 0x08, 0x08, 0x00
};

const char WIDTH = 128;
const char HEIGHT = 64;
const char WHITE = 1;
const char BLACK = 0;


void spiTransfer(const char* data, int length) {
    int i = 0;
    while(i < length) spi.write(data[i++]);
}

void oled_cmd(const char* cmd, int len) {
  _cmd = 0;

  spiTransfer(cmd, len);

  _cmd = 1;
}

void oled_pos(int col, int page) {
  int c1 = col * 2 & 0x0F;
  int c2 = col >> 3;

  int i = 0;
  TXBUF[i++] = 0xb0 | page;
  TXBUF[i++] = 0x00 | c1;
  TXBUF[i++] = 0x10 | c2;
  oled_cmd(TXBUF, i-1);
}


void oled_clear() {
    for (int i=0; i<1024; ++i) SCREEN[i] = 0;
}
void oled_display() {
  oled_pos(0,0);
  spiTransfer(SCREEN, 1024);
}

void oled_init() {
  // Configure SPI link
  _rst = 0;
  spi.format(8,0);
  spi.frequency(8000000);
  _rst = 1;

  // Write init commands
  oled_cmd(INITCOMMAND, INITCOMMAND_LENGTH);

  // Clear screen
  oled_clear();
  oled_display();
}


void oled_draw_bitmap
(int16_t x, int16_t y, const uint8_t *bitmap, uint8_t w, uint8_t h,
 uint8_t color)
{
  // no need to dar at all of we're offscreen
  if (x+w < 0 || x > WIDTH-1 || y+h < 0 || y > HEIGHT-1)
    return;

  int yOffset = abs(y) % 8;
  int sRow = y / 8;
  if (y < 0) {
    sRow--;
    yOffset = 8 - yOffset;
  }
  int rows = h/8;
  if (h%8!=0) rows++;
  for (int a = 0; a < rows; a++) {
    int bRow = sRow + a;
    if (bRow > (HEIGHT/8)-1) break;
    if (bRow > -2) {
      for (int iCol = 0; iCol<w; iCol++) {
        if (iCol + x > (WIDTH-1)) break;
        if (iCol + x >= 0) {
            if (bRow >= 0) {
              if      (color == WHITE) SCREEN[ (bRow*WIDTH) + x + iCol ] |= bitmap[(a*w)+iCol] << yOffset;
              else if (color == BLACK) SCREEN[ (bRow*WIDTH) + x + iCol ] &= ~(bitmap[(a*w)+iCol] << yOffset);
              else                     SCREEN[ (bRow*WIDTH) + x + iCol ] ^= bitmap[(a*w)+iCol] << yOffset;
            }
            if (yOffset && bRow<(HEIGHT/8)-1 && bRow > -2) {
              if      (color == WHITE) SCREEN[ ((bRow+1)*WIDTH) + x + iCol ] |= bitmap[(a*w)+iCol] >> (8-yOffset);
              else if (color == BLACK) SCREEN[ ((bRow+1)*WIDTH) + x + iCol ] &= ~(bitmap[(a*w)+iCol] >> (8-yOffset));
              else                     SCREEN[ ((bRow+1)*WIDTH) + x + iCol ] ^= bitmap[(a*w)+iCol] >> (8-yOffset);
            }
        }
      }
    }
  }
}


int i = 0;
void run() {
    int avatar_y = 32;

    oled_clear();

    oled_draw_bitmap(1,avatar_y, avatar, 20,8, WHITE);
    //SCREEN[uBit.random(1024)] = 3;
    SCREEN[i++%1024] = 60;

    oled_display();
}

int main() {
    oled_init();

    //uBit.init();
    //uBit.display.print(":)");
    //TODO
    //minar::Scheduler::postCallback(&run);
    //minar::Scheduler::postCallback(e).tolerance(minar::milliseconds(2)).period(minar::milliseconds(100));

    while(1) {
        run();
        wait(0.5);
    }
}
