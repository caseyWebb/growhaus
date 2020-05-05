# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.1](https://github.com/caseyWebb/growhaus/compare/v1.3.0...v1.3.1) (2020-05-05)


### Bug Fixes

* limit dimming to 10% minimum for hardware preservation ([cc8b945](https://github.com/caseyWebb/growhaus/commit/cc8b945fefc5d3fe6554b50d35702cb0b484c7ab))

## [1.3.0](https://github.com/caseyWebb/growhaus/compare/v1.2.2...v1.3.0) (2020-05-05)


### Features

* add duration option to manual overrides ([c21eae9](https://github.com/caseyWebb/growhaus/commit/c21eae9384d50cdb1062a3e3d6e28ec4a5524625))

### [1.2.2](https://github.com/caseyWebb/growhaus/compare/v1.2.1...v1.2.2) (2020-05-05)


### Bug Fixes

* actually fix POST endpoint ([7e08cf7](https://github.com/caseyWebb/growhaus/commit/7e08cf7469520617ea8f96bbbf421e2fb3c8eb3d))

### [1.2.1](https://github.com/caseyWebb/growhaus/compare/v1.2.0...v1.2.1) (2020-05-05)

### Bug Fixes

- http POST endpoint ([8bfc141](https://github.com/caseyWebb/growhaus/commit/8bfc141b68752333dc302b30109f2e456527e8fc))

## [1.2.0](https://github.com/caseyWebb/growhaus/compare/v1.1.1...v1.2.0) (2020-05-05)

### Features

- add GET request handler ([e9df753](https://github.com/caseyWebb/growhaus/commit/e9df753a520ee62417ea80282bf71333d1bb36d7))
- add POST api ([11b203d](https://github.com/caseyWebb/growhaus/commit/11b203d033889bee1966728cbc4f290e7049d5f3))

### [1.1.1](https://github.com/caseyWebb/growhaus/compare/v1.1.0...v1.1.1) (2020-05-05)

## [1.1.0](https://github.com/caseyWebb/growhaus/compare/v0.0.1...v1.1.0) (2020-05-05)

### Features

- **agent:** add systemd service unit ([e34531f](https://github.com/caseyWebb/growhaus/commit/e34531f43f2bc0a0d6a1ad5beae101cb6a4676e2))

### Bug Fixes

- set brightness on boot ([776636c](https://github.com/caseyWebb/growhaus/commit/776636c0aba1cf8f85a97472f92aa3248319ff32))
- **agent:** Allow zero-point usage of state.setBrightness ([ce4fd0d](https://github.com/caseyWebb/growhaus/commit/ce4fd0d44d1b4ad492fe095be96f61e8a6e833af))
- **agent:** circular require ([25d8049](https://github.com/caseyWebb/growhaus/commit/25d8049a6658b1f955e4a2c5d744dda8bb5081cb))
- **agent:** Don't use johnny-five REPL' ([1d0c8d3](https://github.com/caseyWebb/growhaus/commit/1d0c8d393949e6f6611082b29c358ba4ae545737))
- **agent:** Parse websocket JSON string ([09aba9d](https://github.com/caseyWebb/growhaus/commit/09aba9d8393d27208474a042ebd40998d7fd29a5))
- **agent:** pi io import (actually) ([9f82658](https://github.com/caseyWebb/growhaus/commit/9f826585c56de0d78d1d149e35185c7103d26feb))
- **agent:** pi-io importing ([6648c13](https://github.com/caseyWebb/growhaus/commit/6648c132f3b48664d451afc4233495c9f21000cc))
- **agent:** Remove trailing slash typo from name ([91023ce](https://github.com/caseyWebb/growhaus/commit/91023ceb842cc10b04bde65f981eca97ac5f7355))
- **agent:** Stringify message to server ([2d97d0c](https://github.com/caseyWebb/growhaus/commit/2d97d0c3467596a6582409f48b84c156617b2c60))
- **agent:** Use GPIO18 instead of 18 as default ([9b21725](https://github.com/caseyWebb/growhaus/commit/9b217256918d86beae56df551c3b6617b163b7a7))
- **server:** omit non-state agent data ([42b12e4](https://github.com/caseyWebb/growhaus/commit/42b12e45cbf7e4edb2a7b78baa8c78f77a658211))
- **server:** Parse incoming data from agent ([8428375](https://github.com/caseyWebb/growhaus/commit/84283759dc0ab45ed69cfc6e8680ba5bfd169b95))
- **server:** Send weather data on agent connection ([c1971a1](https://github.com/caseyWebb/growhaus/commit/c1971a142aaf2c08e63b337ecc3af98d6dd4a80b))
- growhaus server bin ([e63ac54](https://github.com/caseyWebb/growhaus/commit/e63ac5436b32c7060eb111845bbadb3c306e491e))
