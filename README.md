# Introduction

## Known Bugs

## Description

HioB ist eine App Anwendung, die es ermöglicht deine Geräte von deinem ioBroker über eine HandyApp zu steuern.&#x20;



**Warum solltest man diese App benutzen**: Die App bietet eine Performante Lösung, um dein SmartHome über dein Handy zu bedienen. Zudem bietet die App eine einfache Einrichtung.

**ACHTUNG**: Die App ist noch einen sehr fürhen Entwicklungsstatus.

## Installation

Zunächst musst du den HioB Adapter manuell installieren:

* Der Adpater muss manuell über die Konsole installiert werden

```
npm install iobroker.hiob
iobroker add hiob 
```

* Nach der Installation wird ein gültiger und freier Port für den Adapter benötigt (z.B. 8090), dieser muss bei den Adapter-Einstellungen angeben werden



## App Einrichtung:

### Installation:&#x20;

* Installiere die App [hier](https://hiob.bachmaiers.de)

### Geräte Einrichten

#### Geräte Strucktur

* Ein Gerät besteht aus mehreren Datenpunkte
* Die meisten Widgets benötigen dabei jeweils **nur ein** Datenpunkt des jeweiligen Gerätes

#### Manuell in der App:&#x20;

* Es kann jederzeit Manuell ein Gerät unter "Device-Settings" hinzugefügt/bearbeitet werden
* Hierfür werden die ObjectIDs vom IoBroker-Datenpunkt benötigt

#### Manuell im IoBroker (Empfohlen):

*   Zunächst muss eine Aufzählungskategorie mit der ID „hiob“ erstellt werden

    ![](.gitbook/assets/grafik.png)
* Nun können Geräte in diese Kategorie hinzugefügt werden.
  * Füge **nur** Datenpunkte hinzu, die direkt angesteuert werden können (also keine Ordner o.ä)
  * Alle Kategorie-Elemente, die **Datenpunkte enthalten** werden später von der App als eigenes Device eingerichtet. (Im Foto oben, würde die App somit nur ein Gerät mit dem Namen "WohnzimmerLicht" und dessen Datenpunkt erstellen)
*   Daraufhin muss in der App folgendes gemacht werden:&#x20;

    1. Bei „Update Enums“ auf „Update“ klicken&#x20;
    2. Bei „Import Enums“ auf „Import“ klicken

    Daraufhin werden **alle Geräte** aus der HioB-Aufzählung importiert.

**Wichtig:** Füge nur einzelne Datenpunkte hinzu, die später auch in der App benötigt werden.

**Tipp:** Je nach Anzahl bzw. Komplexität des SmartHomes ist eine Gruppierung (z.B. nach Stockwerken, Räumen oder Gerätetypen) zu empfehlen.

### Tabs/Screens Hinzufügen

* Unter "Screen-Settings" kannst du einen neuen Screen/Tab hinzufügen
* In jedem Screen kannst du (nachdem dem du diese hinzugefügt hast) verschiedene [Widgets](https://app.gitbook.com/s/YWLvuNyLNp6aa7cn2y33/\~/changes/oA9p3RZ4zPIZXkJxzQ1V/widgets)/Gruppen hinzufügen
* Die Reihenfolge kann nachträglich über Drag-and-Drop ändern

### Widgets erstellen

* Widgets können unter "Widget-Settings" erstellt werden
* Der Name des Widget bestimmt dabei den Anzeigenamen unter "Widget-Settings"
* Der optionale "Value" des Widgtes bestimmt dabei den Anzeigetext auf der Hauptseite
* Um ein Widget benutzen zu können, muss dieses noch einem beliebigen Screen/Tab oder Gruppe unter "Screen-Settings" hinzugefügt werden
* Eine vollständige Liste aller Widgets kann [hier](widgets.md) gefunden werden



