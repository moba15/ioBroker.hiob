![Logo](../../admin/hiob.png)

-   [Create Button](button.md)
-   [Create Value](value.md)
-   [Create Advanced](advanced.md)
-   [Create Switch with Slider](switch_w_slider.md)
-   [Create Division Line](division.md)
-   [Create Web View](webview.md)
-   [Create Graph (only sql Adapter)](graph.md)
-   [Create Color Palette](color.md)
-   [Create Network Media Player](media_player.md)

## Table

### With Table you can display JSON

- Swipe left to delete a widget.
- Press the plus sign at the bottom right.

![app_create_web_done.png](img/../../de/img/app_create_web_done.png)

- Dropdown: select `Table`.
- Name: Name of the widget
- Header: Header text from the table
- Elements per Page: How many elements are displayed per page.
- initial sort: Sorts the array (first element)
- Device: Select the desired listing.
- Datapoint: Selection of states from the selected collection - The value must have an array with JSON element.

![add_create_table.png](img/../../de/img/add_create_table.png)

- Example JSON
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

- add: Now create the desired columns. Here in the example it is `name` and `state`. The key from the JSON must be entered in `column key`. You can assign a name in `column name`.

![add_create_table_column_1.png](img/../../de/img/add_create_table_column_1.png)
![add_create_table_column_2.png](img/../../de/img/add_create_table_column_2.png)
![add_create_table.png](img/../../de/img/add_create_table_column.png)

- Then press save.
- A long press on a widget switches to copy mode. Here you can select widgets from which a copy should be created.

![app_create_table_done.png](img/../../de/img/app_create_table_done.png)

- Add the widget to a screen.

![app_create_table_screen.png](img/../../de/img/add_create_table_screen.png)

-   [Create Button](button.md)
-   [Create Value](value.md)
-   [Create Advanced](advanced.md)
-   [Create Switch with Slider](switch_w_slider.md)
-   [Create Division Line](division.md)
-   [Create Web View](webview.md)
-   [Create Graph (only sql Adapter)](graph.md)
-   [Create Color Palette](color.md)
-   [Create Network Media Player](media_player.md)