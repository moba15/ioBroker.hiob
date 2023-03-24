# App Einrichtung

## Verbindung mit dem Adapter

Zunächst muss die richtige IP und der richtige Port in den "IoBroker-Settings" eingetragen werden, darauf kann über "Reconnect" eine Verbindungsanfrage erstellt werden

<figure><img src="../.gitbook/assets/connection_example (1).jpg" alt=""><figcaption></figcaption></figure>

Daraufhin ist eine Anmeldung erforderlich:

* Es muss nun ein Nutzer und ein Passwort in der App hinterlegt werden (selbe Anmeldedaten wie für IoBroker Admin Oberfläche)
* Falls kein Nutzer mit einem Passwort benutzt wird, so muss Use Password Login abgewählt werden (bis jetzt nur für Beta Nutzer zugänglich)
* Daraufhin muss in der IoBroker Oberfläche die Verbindung manuell erlaubt werden, dafür muss der Datenpunkt unter hiob.\<Instanz nummer>.devices.\<Geräte Name>.approved auf **true** gestezt werden (**Wichtig: Die App muss dafür offen bleiben**)
* Falls eine Anmeldung ohne Passwort erlaubt werden soll muss der zusätzlich noch der Datenpunkt **noPwdAllowed** auf **true** gesetzt werden

## Geräte Einrichten

### Geräte Struktur

* Ein Gerät besteht aus mehreren Datenpunkte
* Die meisten Widgets benötigen dabei jeweils **nur ein** Datenpunkt des jeweiligen Gerätes

### Manuelle Einrichtung in der App

* Es kann jederzeit Manuell ein Gerät unter "Device-Settings" hinzugefügt/bearbeitet werden
* Hierfür werden die ObjectIDs vom IoBroker-Datenpunkt benötigt

### Manuell im IoBroker (Empfohlen):

* Zunächst muss eine Aufzählungskategorie mit der ID „hiob“ erstellt werden

<figure><img src="../.gitbook/assets/aufzählung_1e (1).png" alt=""><figcaption></figcaption></figure>

* Nun können Geräte in diese Kategorie hinzugefügt werden.
  * Füge **nur** Datenpunkte hinzu, die direkt angesteuert werden können (also keine Ordner o.ä)
  * Alle Kategorie-Elemente, die **Datenpunkte enthalten** werden später von der App als eigenes Device eingerichtet.
* Daraufhin muss in der App folgendes gemacht werden:
  1. Bei „Update Enums“ auf „Update“ klicken
  2. Bei „Sync Enums“ auf „Sync“ klicken  (Achtung: Dies kann manuell erstellte Geräte löschen)

**Tipp:** Je nach Anzahl bzw. Komplexität des SmartHomes ist eine Gruppierung (z.B. nach Stockwerken, Räumen oder Gerätetypen) zu empfehlen.

## Tabs/Screens Hinzufügen

Screens werden später als Tab oberhalb angezeigt, zwischen denen man wechseln kann:

<figure><img src="../.gitbook/assets/aufzählung_1e.png" alt=""><figcaption></figcaption></figure>

* Unter "Screen-Settings" kannst du einen neuen Screen/Tab hinzufügen
* In jedem Screen kannst du (nachdem dem du diese hinzugefügt hast) verschiedene [Widgets](https://app.gitbook.com/s/YWLvuNyLNp6aa7cn2y33/\~/changes/oA9p3RZ4zPIZXkJxzQ1V/widgets)/Gruppen hinzufügen
* Die Reihenfolge kann nachträglich über Drag-and-Drop ändern

### Widgets erstellen

* Widgets können unter "Widget-Settings" erstellt werden
* Der Name des Widget bestimmt dabei den Anzeigenamen unter "Widget-Settings"
* Der optionale "Value" des Widgtes bestimmt dabei den Anzeigetext auf der Hauptseite
* Um ein Widget benutzen zu können, muss dieses noch einem beliebigen Screen/Tab oder Gruppe unter "Screen-Settings" hinzugefügt werden
* Eine vollständige Liste aller Widgets kann [hier](widgets.md) gefunden werden
