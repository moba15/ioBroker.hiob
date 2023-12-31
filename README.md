# Introduction

## Known Bugs

* Graph Widget funktioniert nicht mehr
* Falls in der App ein Datenpunkt hinterlegt ist der nicht mehr exestiert kann dies zum Absturz des Adapters führen

Please report any bugs to the Forum: https://forum.iobroker.net/topic/55250/neuer-adapter-hiob-handy-app/ or here in GitHub

## Description

HioB ist eine App Anwendung, die es ermöglicht deine Geräte von deinem ioBroker über eine HandyApp zu steuern.

**Warum solltest man diese App benutzen**: Die App bietet eine performante Lösung, um dein SmartHome über dein Handy zu bedienen. Zudem bietet die App eine einfache Einrichtung.

**ACHTUNG**: Die App ist noch einen sehr fürhen Entwicklungsstatus.

## Description

### Installation

```bash
cd /opt/iobroker
npm install iobroker.hiob
```

English: [Description](/docs/en/README.md)</br>
German: [Beschreibung](/docs/de/README.md)
</br> Thanks to [Lucky-ESA](https://github.com/Lucky-ESA)

## Changelog 0.0.54

* Added secure login

## Coming with 0.0.40

* Allow Login without password (Settings -> IoBroker Settings): [more infos](app-einrichtung/#verbindung-mit-dem-adapter)
* You will be able to upload and load setting to/from ioBroker
  * Settings -> Config Sync&#x20;
    * Press the "+" to add a new Config
    * Press upload/load to select which settings you want to upload/load to/from IoBroker
    * Press the "update" key in the top right corner to update your Settings list
  * Find the Config under hiob.x.settings.\<name> in IoBroker

## License

MIT

Copyright (c) 2022 mor15Euro [hiob@bachmaiers.de](http://localhost:5000/u/bh3bIYvKVLQXD837pc8JlAJHx3Z2)
