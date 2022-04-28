# Introduction

## Installation

Zunächst musst du den HioB Adapter manuell installieren:

* Der Adpater muss manuell Installiert werden, hierfür muss der Expertenmodus im IoBroker aktiviert werden
* Die aktuellste Version findest auf GitHub: [https://github.com/mor15Euro1/ioBroker.HioB.git  ](https://github.com/mor15Euro1/ioBroker.HioB.git)
* Nach der Installation wird ein gültiger und freier Port für den Adapter benötigt (z.B. 8090), dieser muss bei den Adapter-Einstellungen angeben werden



## App Einrichtung:

### Installation:&#x20;

* Installieren die App unter [https://play.google.com/store/apps/details?id=de.bachmaier.smart\_home](https://play.google.com/store/apps/details?id=de.bachmaier.smart\_home)

### Geräte Einrichten

#### Geräte Strucktur

* Ein Gerät besteht aus mehreren Datenpunkte
* Die meisten Widgets benötigen dabei jeweils **nur ein** Datenpunkt des jeweiligen Gerätes

#### Manuell in der App:&#x20;

* Es kann jederzeit Manuell ein Gerät unter "Device-Settings" hinzugefügt/bearbeitet werden
* Hierfür werden die ObjectIDs vom IoBroker-Datenpunkt benötigt

#### Manuell im IoBroker (Empfohlen):

* Zunächst muss eine Aufzählungskategorie mit der ID „hiob“ erstellt werden
* Nun können Geräte in diese Kategorie hinzugefügt werden.
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



