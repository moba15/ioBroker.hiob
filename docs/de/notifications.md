## Notifications

❗**Wichtig** ❗: Dieses Feature ist noch in der beta Phase. Das bedeutet:

- Wenn die App **keine** aktive Verbindung zum ioBroker hat, so werden bis zu **maximal** 250 Nachrichten gespeichert. Und bei neu Verbindung gesendet
- Es gibt **keine** Garantie, dass Benachrichtigungen empfangen werden
- Es kann zu einem **erheblichen** Akku verbrauch kommen
- Die App kann **jederzeit** die Verbindung zum Server **verlieren**, wenn diese im Hintergrund ist

### Erste Schritte

1. Schalte die Batterieoptimierung auf ihrem Gerät für die App aus. (Unter den Geräteeinstellungen)
   - Dies soll verhindern, dass Android die App im Hintergrund aus Energiespargründen stoppt.
2. Erlaube Benachrichtigungen für die App
3. Aktiviere Background Notifications in der App unter den Einstellungen
4. Starte die App einmal neu

### Benachrichtigungen senden

- Hierfür gehst du in die ioBroker objects und suchst unter hiob.x.devices dein Gerät aus
- Hier sollte nun auch ein "sendNotification" Datenpunkt sein
- Setze den Datenpunkt auf einen beliebigen Text -> Nachricht wird gesendet

### Benutzerdefinierte Benachrichtigungen
#### Schema

```JSON
{
	"$schema": "https://json-schema.org/draft/2019-09/schema",
    "type": "object",
    "properties": {
      "title": {
      	"type": "string",
        "descreption": "The title of your notification",
        "exclusiveMinimum": 0
      },
      "body": {
      	"type": "string",
        "descreption": "The body of your notification",
        "exclusiveMinimum": 0
      },
      "locked": {
      	"type": "boolean",
        "descreption": "Wether it should be dissmisable ",
      },
      "colorARGB": {
      	"type": "string",
        "descreption": "ARGB Color Hex code ",
      },
      "id": {
      	"type": "number",
        "descreption": "Notification ID. If you do not want to send a new notification, give it the same ID and the old one will be overwritten",

      }
   
    }
}
```
#### Beispiel
```JSON
{
  "title": "Bewegung",
  "body": "Es wurde eine Bewungung in der Küche erkannt",
  "locked": false,
  "colorARGB": "FFFF0000"
}
```

#### Blockly sendTo Example
Es ist ebenfalls möglich über Blockly mithilfe der sendTo Funktion Benachrichtigungen zu senden:
- Parameter
  - **uuid**: Die id des Gerätes. Zu finden unter hiob.x.devices
  - **notification**: Die Benachrichtigung die gesendet werden soll: Objekt Schema siehe oben
- **Beispiel** <br>
![Example](img/sendToExample.png)
```JS
sendTo('hiob.0', 'send', { 'uuid': '52e34cca-c85a-423a-a07b-c711a0d1575a', 'notification': { 'title': 'Title', 'body': 'Bewegung erkannt' } });
```
#### Example of using the same id
**Blockly** <br>
![Example](img/notificationBlockly2.png) <br>
**Notification** <br>
![Example](img/notificationIDExample.gif)