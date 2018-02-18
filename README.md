# Clouduboy Platforms
This module is responsible for generating platform binaries (compiled, flashable application binaries, most often these are `.hex` files) for the platforms supported by [Clouduboy][https://clouduboy.org]. The package uses build tools such as [PlatformIO](https://platformio.org/) to compile the C/C++ source code to a flashable package. This tool only takes C/C++ code, MicroCanvas JavaScript code needs to be [translated beforehand](https://github.com/clouduboy/clouduboy-compiler/).

## Installation & usage
After you have cloned/downloaded this repository, run:
```
$ npm install
```

This ensures the neccessary libraries and modules required for compilation are downloaded. Depending on which platform you want to compile your games for, you might need to install extra tools, see below.


### Arduboy
To compile Arduboy binaries you will need to have [PlatformIO](https://platformio.org/) installed on the machine/server you will be using. Please refer to the [PlatformIO Installation Guide](http://docs.platformio.org/en/latest/installation.html). If you have Python installed on the machine already, the easiest way to get PlatformIO working is via `pip`. Please note PlatformIO currently only supports Python 2.7.

```
$ sudo pip2 install -U platformio
```

After this, PlatformIO will install all neccessary plugins you need before your first compilation. To compile an Arduboy C++ (`.ino` or `.cpp`) game/application, place it in `lib/Arduboy-1.1.1/src` and run the `build:arduboy` script.

```
$ npm run build:arduboy
```

If all went well your output hex file will be at `lib/Arduboy-1.1.1/.pioenvs/leonardo/firmware.hex`. Use the [tools listed on the Arduboy homepage](https://arduboy.com/upload-games/) to install your compiled binary (or Clouduboy Flasher) on a compatible device.


### Tiny Arcade
_coming soon_

### BBC Micro:bit
_coming soon_

### Gamebuino
_coming soon_


# License

> This software is licensed under the Apache License, version 2 ("ALv2"), quoted below.
>
> Copyright 2018 István Szmozsánszky, Clouduboy <https://clouduboy.org/>
>
> Licensed under the Apache License, Version 2.0 (the "License");
> you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
> http://www.apache.org/licenses/LICENSE-2.0
>
> Unless required by applicable law or agreed to in writing, software
> distributed under the License is distributed on an "AS IS" BASIS,
> WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
> See the License for the specific language governing permissions and
> limitations under the License.
