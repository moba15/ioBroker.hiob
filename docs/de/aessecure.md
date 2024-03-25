![Logo](../../admin/hiob.png)

-   [Zurück zur Beschreibung](/docs/de/README.md)

# Schritt 1: AES Datenpunkte

-   `hiob.0.devices.xxx.aesKey` Diesen Schlüssel in die APP eintagen
-   `hiob.0.devices.xxx.aesKey_active` Für die Verschlüsselung auf true setzen
-   `hiob.0.devices.xxx.aesKey_new` Neuen Schlüssel generien und die die APP eintragen
-   `hiob.0.devices.xxx.aesKey_view` AES Schlüssel für 30 Sekunden sichtbar machen (Bild 2)

![aes_iobroker.png](img/aes_iobroker.png)
![aes_iobroker.png](img/aes_iobroker_decrypt.png)

# Schritt 2: APP Einstellungen

-   Haken `Use AES encyption` setzen
-   AES Key vom ioBroker eintragen

![aes_app.png](img/../../en/img/aes_app.png)