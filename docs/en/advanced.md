![Logo](../../admin/hiob.png)

-   [Create Button](button.md)
-   [Create Value](value.md)
-   [Create Switch with Slider](switch_w_slider.md)
-   [Create Division Line](division.md)
-   [Create Web View](webview.md)
-   [Create Table](table.md)
-   [Create Graph (only sql Adapter)](graph.md)
-   [Create Color Pallete](color.md)
-   [Create Network Media Player](media_player.md)

## Advanced/Flexible

- Swipe left to delete a widget.
- Press the plus sign at the bottom right.

![app_template.png](img/../../de/img/app_template.png)

- `Name`: Name of Widget
- `Value` (optional): Display text in the widget. If nothing is specified, the name is used.

![app_create_advanced_value.png](img/../../de/img/app_create_advanced_value.png)

- Main Body: Select the desired widget here.

- `Value` This allows a value to be displayed and a new value to be set for a given value
- `Multi Selection` You can create a dropdown here.
- `Slider` You can use the slider to dim lamps or control roller shutters.
- `Handle` A switch where the value can be specified.
- `Button` Currently only one button to set TRUE.

![app_create_advanced_select.png](img/../../de/img/app_create_advanced_select.png)

### Widget `Value`

- `Round to`: Round up after the decimal point
- `Unit (optional)`: Unit of value
- `Device`: Select the desired enum here
- `Datapoint`: Selection of states from the selected enum
- `Text Rules`: To create a rule click on `add`. Enter the value in `Old Value` when the state should then be overwritten with `New Value`. Then press `add` and if no new ones are needed press `exit`. When Value reaches 10, the state is set to 20. Editing is not possible later. The rule can only be deleted with a swipe.

![app_create_advanced_value_view.png](img/../../de/img/app_create_advanced_value_view.png)
![app_create_advanced_value_popup.png](img/../../de/img/app_create_advanced_value_popup.png)

- `Popup Menu`: Additional widgets can be created here. Long-pressing the widget opens a popup menu with the widgets you have created.
- Then press save.
- A long press on a widget switches to copy mode. Here you can select widgets from which a copy should be created.

![app_create_advanced_value_popup_create_1.png](img/../../de/img/app_create_advanced_value_popup_create_1.png)
![app_create_advanced_value_popup_create_2.png](img/../../de/img/app_create_advanced_value_popup_create_2.png)
![app_create_advanced_value_popup_view_done_1.png](img/../../de/img/app_create_advanced_value_popup_view_done_1.png)
![app_create_advanced_value_popup_view_done_2.png](img/../../de/img/app_create_advanced_value_popup_view_done_2.png)

### Widget `Multi Selection`

![app_create_multi.png](img/../../de/img/app_create_multi.png)

- `Device`: Select the desired enum here
- `Datapoint`: Selection of states from the selected enum

![app_create_multi_device.png](img/../../de/img/app_create_multi_device.png)

- `Selections`: To create a list click on `add`. Enter a name for the selection in `Display Value` and enter the value that should be moved into the state in `File Point Value`. The selections can be sorted later by long pressing. Editing is not possible later. The rule can only be deleted with a swipe.
- `Popup Menu`: Additional widgets can be created here. Long-pressing the widget opens a popup menu with the widgets you have created.
- Then press save.
- A long press on a widget switches to copy mode. Here you can select widgets from which a copy should be created.

![app_create_multi_option.png](img/../../de/img/app_create_multi_option.png)
![app_create_multi_option_1.png](img/../../de/img/app_create_multi_option_1.png)
![app_create_multi_option_2.png](img/../../de/img/app_create_multi_option_2.png)

- This is what it looks like in the view. Here you can also see that the 0 was forgotten.

![app_create_multi_done_1.png](img/../../de/img/app_create_multi_done_1.png)
![app_create_multi_done_2.png](img/../../de/img/app_create_multi_done_2.png)
![app_create_multi_done_3.png](img/../../de/img/app_create_multi_done_3.png)

### Widget `Slider`

- `Device`: Select the desired enum here
- `Datapoint`: Selection of states from the selected enum - state must be number 0-x!

![app_create_advanced_slider.png](img/../../de/img/app_create_advanced_slider.png)

- `Min`: Minimum value (default 0).
- `Max`: Value maximum (default 100).
- `Steps`: In which steps changes can be made (standard 10).
- `Popup Menu`: Additional widgets can be created here. Long-pressing the widget opens a popup menu with the widgets you have created.
- Then press save.
- A long press on a widget switches to copy mode. Here you can select widgets from which a copy should be created.

![app_create_advanced_slider_value.png](img/../../de/img/app_create_advanced_slider_value.png)

- This is what it looks like in the view.

![app_create_advanced_slider_done.png](img/../../de/img/app_create_advanced_slider_done.png)

### Widget `Handle`

- `Device`: Select the desired enum here
- `Datapoint`: Selection of states from the selected enum - state must be number 0-x!

![app_create_advanced_handle.png](img/../../de/img/app_create_advanced_handle.png)

- `Send if on`: Value that should be set in the states when ON.
- `Send if off`: Value that should be set in the states when OFF.
- `Popup Menu`: Additional widgets can be created here. Long-pressing the widget opens a popup menu with the widgets you have created.
- Then press save.
- A long press on a widget switches to copy mode. Here you can select widgets from which a copy should be created.

![app_create_advanced_handle_value.png](img/../../de/img/app_create_advanced_handle_value.png)

- This is what it looks like in the view.

![app_create_advanced_handle_done.png](img/../../de/img/app_create_advanced_handle_done.png)

### Widget `Button`

- `Device`: Select the desired enum here
- `Datapoint`: Selection of states from the selected enum - state must be number 0-x!

![app_create_advanced_handle.png](img/../../de/img/app_create_advanced_button.png)

- `Button Lable`: Text in the button.
- `Popup Menu`: Additional widgets can be created here. Long-pressing the widget opens a popup menu with the widgets you have created.
- Then press save.
- A long press on a widget switches to copy mode. Here you can select widgets from which a copy should be created.

![app_create_advanced_handle_value.png](img/../../de/img/app_create_advanced_button_value.png)

- This is what it looks like in the view.

![app_create_advanced_handle_done.png](img/../../de/img/app_create_advanced_button_done.png)


-   [Create Button](button.md)
-   [Create Value](value.md)
-   [Create Switch with Slider](switch_w_slider.md)
-   [Create Division Line](division.md)
-   [Create Web View](webview.md)
-   [Create Table](table.md)
-   [Create Graph (only sql Adapter)](graph.md)
-   [Create Color Pallete](color.md)
-   [Create Network Media Player](media_player.md)