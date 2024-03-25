![Logo](admin/hiob.png)

# ioBroker.hiob

**Infos:** </br>
[![GitHub license](https://img.shields.io/github/license/moba15/ioBroker.hiob)](https://github.com/moba15/ioBroker.hiob/blob/main/LICENSE)
[![NPM version](https://img.shields.io/npm/v/iobroker.hiob.svg)](https://www.npmjs.com/package/iobroker.hiob)
[![Downloads](https://img.shields.io/npm/dm/iobroker.hiob.svg)](https://www.npmjs.com/package/iobroker.hiob)
![Number of Installations](https://iobroker.live/badges/hiob-installed.svg)
![GitHub size](https://img.shields.io/github/repo-size/moba15/ioBroker.hiob)</br>
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/moba15/ioBroker.hiob)
![GitHub commits since latest release](https://img.shields.io/github/commits-since/moba15/ioBroker.hiob/latest)
![GitHub last commit](https://img.shields.io/github/last-commit/moba15/ioBroker.hiob)
![GitHub issues](https://img.shields.io/github/issues/moba15/ioBroker.hiob)</br>
**Version:** </br>
![Beta](https://img.shields.io/npm/v/iobroker.hiob.svg?color=red&label=beta)

[![NPM](https://nodei.co/npm/iobroker.hiop.png?downloads=true)](https://nodei.co/npm/iobroker.hiob/)

**Tests:** </br>
![Test and Release](https://github.com/moba15/ioBroker.hiob/workflows/Test%20and%20Release/badge.svg)

## HioB adapter for ioBroker

-   Data points can be controlled with the HioB APP.

## Requirements

-   Node >= 16
-   Android Phone

## Tested with

-   Samsung Android Phones
-   Google Pixel Android Phones
-   Sony Pixel Android Phones

## APP Code

[APP Code](https://github.com/moba15/hiob_app)

## Description

🇬🇧 [Description](/docs/en/README.md)</br>
🇩🇪 [Beschreibung](/docs/de/README.md)

## Questions

🇩🇪 [Fragen](https://forum.iobroker.net/topic/55250/neuer-adapter-hiob-handy-app)

## Changelog

<!--
    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**
-->
 ### **WORK IN PROGRESS**
 - (moba15) Fixed #25
 - (moba15) sendTo support for notifications

### 0.0.66-beta.0 (2024-03-22)
- First implementation of notifications

### 0.0.65 (2024-03-15)
 - (moba15) fixed linter

### 0.0.64 (2024-03-15) 
- (moba15) changed icon
- fixed code linter problems

### 0.0.62 (2024-03-04)
- (moba15) fixed bug, where broadcasted messages where sent without type
### 0.0.62 (2024-03-04)
- (moba15) fixed bug, where broadcasted messages where sent without type

### 0.0.61 (2024-03-04)
 - (moba15) fixed secure connection bug (#20)

### 0.0.61-beta.0 (2024-03-01)
- (Lucky-ESA) Preperation of lastest request
- (moba15) fixed some smaller issues

### 0.0.60 (2024-02-25)

-   (Lucky-ESA) Added simple AES encryption
-   (Lucky-ESA) Preperation for latest request
-   (moba15) Fixed login errors if AES encryption is disabled

### 0.0.55 (2023-02-11)

-   (moba15) Fixed Adapter crash if data point does not exist
-   (moba15) Fixed some login errors

### 0.0.54 (2023-12-31)

-   (moba15) Added secure login
-   (moba15) Added secure connetion
-   (moba15) Automatic acceptance of incoming connections for 60 seconds

### 0.0.1 (2023-03-26)

-   (moba15) initial release

## License

MIT License

Copyright (c) 2023-2024 mor15Euro [hiob@bachmaiers.de](http://localhost:5000/u/bh3bIYvKVLQXD837pc8JlAJHx3Z2)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
