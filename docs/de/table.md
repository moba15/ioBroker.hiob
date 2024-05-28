![Logo](../../admin/hiob.png)

-   [Button erstellen](button.md)
-   [Value erstellen](value.md)
-   [Advanced erstellen](advanced.md)
-   [Switch with Slider erstellen](switch_w_slider.md)
-   [Division Line erstellen](division.md)
-   [Web View erstellen](webview.md)
-   [Graph (only sql Adapter) erstellen](graph.md)
-   [Color Palette erstellen](color.md)
-   [Network Media Player erstellen](media_player.md)

## Table

### Mit Table kann ein JSON anzeigen lassen

- Nach links wischen um ein Widget zu löschen.
- Rechts unten das Pluszeichen drücken.

![app_create_web_done.png](img/app_create_web_done.png)


- Dropdown: `Table` auswählen.
- Name: Name vom Widget
- Header: Kopftext vom Table
- Elements per Page: Wie viele Elemente pro Seite angezeigt werden.
- initial sort: Sortiert den Array (erste Element)
- Device: Die gewünschte Auflistung wählen.
- Datapoint: Auswahl der Datenpunkte aus der gewählten Auflistung - Der Wert muss ein Array mit JSON Element haben.

![add_create_table.png](img/add_create_table.png)

- Beispiel JSON
```json
[
  {
    "name": "Fenster Gäste WC",
    "zustand": "👈 geöffnet"
  },
  {
    "name": "Fenster Schlafzimmer",
    "zustand": "👈 geöffnet"
  },
  {
    "name": "Fenster Arbeitszimmer",
    "zustand": "☝️ gekippt"
  }
  {
    "name": "Dachfenster",
    "zustand": "🪟 geschlossen"
  }
]
```

- add: Nun die gewünschten Spalten erstellen. Hier im Beispiel sind es `name` und `zustand`. In `column key` muss der key aus dem JSON eingetragen werden. In `column name` kann man einen Namen vergeben.
![add_create_table_column_1.png](img/add_create_table_column_1.png)
![add_create_table_column_2.png](img/add_create_table_column_2.png)
![add_create_table.png](img/add_create_table_column.png)

- Danach speichern drücken.
- Durch langes drücken auf ein Widget wird auf den Kopiermodus gewechselt. Hier können Widgets ausgewählt werden von den eine Kopie erstellt werden soll.

![app_create_table_done.png](img/app_create_table_done.png)

- Das Widget einem Screen hinzufügen.

![app_create_table_screen.png](img/add_create_table_screen.png)


-   [Button erstellen](button.md)
-   [Value erstellen](value.md)
-   [Advanced erstellen](advanced.md)
-   [Switch with Slider erstellen](switch_w_slider.md)
-   [Division Line erstellen](division.md)
-   [Web View erstellen](webview.md)
-   [Graph (only sql Adapter) erstellen](graph.md)
-   [Color Palette erstellen](color.md)
-   [Network Media Player erstellen](media_player.md)