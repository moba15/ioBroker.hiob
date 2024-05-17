![Logo](../../admin/hiob.png)

-   [Button erstellen](button.md)
-   [Value erstellen](value.md)
-   [Switch with Slider erstellen](switch_w_slider.md)
-   [Division Line erstellen](division.md)
-   [Web View erstellen](webview.md)
-   [Table erstellen](table.md)
-   [Graph (only sql Adapter) erstellen](graph.md)
-   [Color Palette erstellen](color.md)
-   [Network Media Player erstellen](media_player.md)

## Advanced/Flexible

- Nach links wischen um ein Widget zu löschen.
- Rechts unten das Pluszeichen drücken.

![app_template.png](img/app_template.png)

- `Name`: Name vom Widget
- `Value` (optional): Anzeigetext im Widget. Wird nichts angegeben wird der Name verwendet.

![app_create_advanced_value.png](img/app_create_advanced_value.png)

- Main Body: Hier das gewünschte Widget auswählen.

- `Value` Damit kann ein Value angezeigt werden und zusätzlich bei einem vorgegebenen Wert einen neuen Wert setzen
- `Multi Selection` Hier kann man ein Dropdown erstellen.
- `Slider` Mit dem Slider kann man Lampen dimmen oder Rollladen steuern.
- `Handle` Ein Switch bei dem der Wert vorgeben werden kann.
- `Button` Derzeit nur ein Button um TRUE zu setzen.

![app_create_advanced_select.png](img/app_create_advanced_select.png)

### Widget `Value`

- `Round to`: Nach dem Komma aufrunden
- `Unit (optional)`: Einheit vom Value
- `Device`: Hier den gewünschten Enum auswählen
- `Datapoint`: Auswahl der Datenpunkte aus dem gewählten Enum
- `Text Rules`: Um eine Regel zu erstellen auf `add` klicken. In `Old Value` den Wert eintragen wann der Datenpunkt dann mit `New Value` überschrieben werden soll. Dann `add` drücken und wenn keine neuen benötigt werden `exit` drücken. Wenn Value die 10 erreicht wird der Datenpunkt auf 20 gesetzt. Eine Editierung ist später nicht möglich. Die Regel kann nur mit wischen gelöscht werden.

![app_create_advanced_value_view.png](img/app_create_advanced_value_view.png)
![app_create_advanced_value_popup.png](img/app_create_advanced_value_popup.png)

- `Popup Menu`: Hier können weitere Widgets erstellt werden. Durch langes drücken auf das Widget öffnet sich ein Popup Menu mit den erstellten Widgets.
- Danach speichern drücken.
- Durch langes drücken auf ein Widget wird auf den Kopiermodus gewechselt. Hier können Widgets ausgewählt werden von den eine Kopie erstellt werden soll.

![app_create_advanced_value_popup_create_1.png](img/app_create_advanced_value_popup_create_1.png)
![app_create_advanced_value_popup_create_2.png](img/app_create_advanced_value_popup_create_2.png)
![app_create_advanced_value_popup_view_done_1.png](img/app_create_advanced_value_popup_view_done_1.png)
![app_create_advanced_value_popup_view_done_2.png](img/app_create_advanced_value_popup_view_done_2.png)

### Widget `Multi Selection`

![app_create_multi.png](img/app_create_multi.png)

- `Device`: Hier den gewünschten Enum auswählen
- `Datapoint`: Auswahl der Datenpunkte aus dem gewählten Enum

![app_create_multi_device.png](img/app_create_multi_device.png)

- `Selections`: Um eine Auflistung zu erstellen auf `add` klicken. In `Display Value` einen Namen der Auswahl angeben und in `Dateipoint Value` den Wert eintragen der in den Datenpunkt geschieben werden soll. Die Selections können später durch langes Drücken noch sortiert werden. Eine Editierung ist später nicht möglich. Die Regel kann nur mit wischen gelöscht werden.
- `Popup Menu`: Hier können weitere Widgets erstellt werden. Durch langes drücken auf das Widget öffnet sich ein Popup Menu mit den erstellten Widgets.
- Danach speichern drücken.
- Durch langes drücken auf ein Widget wird auf den Kopiermodus gewechselt. Hier können Widgets ausgewählt werden von den eine Kopie erstellt werden soll.

![app_create_multi_option.png](img/app_create_multi_option.png)
![app_create_multi_option_1.png](img/app_create_multi_option_1.png)
![app_create_multi_option_2.png](img/app_create_multi_option_2.png)

- So sieht es dann in der View aus. Hier erkennt man auch das vergessen wurde die 0 anzulegen.

![app_create_multi_done_1.png](img/app_create_multi_done_1.png)
![app_create_multi_done_2.png](img/app_create_multi_done_2.png)
![app_create_multi_done_3.png](img/app_create_multi_done_3.png)

### Widget `Slider`

- `Device`: Hier den gewünschten Enum auswählen
- `Datapoint`: Auswahl der Datenpunkte aus dem gewählten Enum - Datenpunkt muss number 0-x sein!

![app_create_advanced_slider.png](img/app_create_advanced_slider.png)

- `Min`: Wert minimal (Standard 0).
- `Max`: Wert maximal (Standard 100).
- `Steps`: In welchen Schritten Änderungen durchgeführt werden dürfen (Standard 10).
- `Popup Menu`: Hier können weitere Widgets erstellt werden. Durch langes drücken auf das Widget öffnet sich ein Popup Menu mit den erstellten Widgets.
- Danach speichern drücken.
- Durch langes drücken auf ein Widget wird auf den Kopiermodus gewechselt. Hier können Widgets ausgewählt werden von den eine Kopie erstellt werden soll.

![app_create_advanced_slider_value.png](img/app_create_advanced_slider_value.png)

- So sieht es dann in der View aus.

![app_create_advanced_slider_done.png](img/app_create_advanced_slider_done.png)

### Widget `Handle`

- `Device`: Hier den gewünschten Enum auswählen
- `Datapoint`: Auswahl der Datenpunkte aus dem gewählten Enum - Datenpunkt muss number 0-x sein!

![app_create_advanced_handle.png](img/app_create_advanced_handle.png)

- `Send if on`: Wert der bei AN in den Datenpunkte gesetzt werden soll.
- `Send if off`: Wert der bei AUS in den Datenpunkte gesetzt werden soll.
- `Popup Menu`: Hier können weitere Widgets erstellt werden. Durch langes drücken auf das Widget öffnet sich ein Popup Menu mit den erstellten Widgets.
- Danach speichern drücken.
- Durch langes drücken auf ein Widget wird auf den Kopiermodus gewechselt. Hier können Widgets ausgewählt werden von den eine Kopie erstellt werden soll.

![app_create_advanced_handle_value.png](img/app_create_advanced_handle_value.png)

- So sieht es dann in der View aus.

![app_create_advanced_handle_done.png](img/app_create_advanced_handle_done.png)

### Widget `Button`

- `Device`: Hier den gewünschten Enum auswählen
- `Datapoint`: Auswahl der Datenpunkte aus dem gewählten Enum - Datenpunkt muss number 0-x sein!

![app_create_advanced_handle.png](img/app_create_advanced_button.png)

- `Button Lable`: Text im Button.
- `Popup Menu`: Hier können weitere Widgets erstellt werden. Durch langes drücken auf das Widget öffnet sich ein Popup Menu mit den erstellten Widgets.
- Danach speichern drücken.
- Durch langes drücken auf ein Widget wird auf den Kopiermodus gewechselt. Hier können Widgets ausgewählt werden von den eine Kopie erstellt werden soll.

![app_create_advanced_handle_value.png](img/app_create_advanced_button_value.png)

- So sieht es dann in der View aus.

![app_create_advanced_handle_done.png](img/app_create_advanced_button_done.png)


-   [Button erstellen](button.md)
-   [Value erstellen](value.md)
-   [Switch with Slider erstellen](switch_w_slider.md)
-   [Division Line erstellen](division.md)
-   [Web View erstellen](webview.md)
-   [Table erstellen](table.md)
-   [Graph (only sql Adapter) erstellen](graph.md)
-   [Color Palette erstellen](color.md)
-   [Network Media Player erstellen](media_player.md)