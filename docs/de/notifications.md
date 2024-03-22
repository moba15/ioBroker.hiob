## Notifications

❗**Wichtig** ❗: Dieses Feature ist noch in der beta Phase. Das bedeutet:
- Wenn die App **keine** aktive Verbindung zum ioBroker hat, so werden gehen alle gesendeten Nachrichten innerhalb des Zeitraums **verloren**
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
**Incoming**