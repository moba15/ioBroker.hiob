![Logo](../../admin/hiob.png)

-   [Zurück zur Beschreibung](/docs/de/README.md)
-   [Schritt 2: ENUMS erstellen](enum.md)
-   [Schritt 3: Widgets erstellen](widgets.md)
-   [Schritt 4: Screens erstellen](sreens.md)
-   [Schritt 5: Backups erstellen](backups.md)

## Installation und APP Einrichtung `ioBroker Settings`

# Schritt 1: Installation und APP Einrichtung

# Schritt 1: Instanz Einstellungen

1. Bitte einen freien Port (Standard ist 8090) eintragen. Sollte der ausgewählte Port belegt sein, wird der nächste freie Port verwendet. Dieser wird ins Log geschrieben und sollte dann in die Konfig-Instanz übernommen werden.
2. Für das Grafik Widget benötigt man entweder den SQL oder Histroy Adapter um Änderungen von Datenpunkte aufzuzeichnen. Bitte entweder eine SQL- oder History-Instanz auswählen.
3. Nun den Adapter starten.
![instance.png](img/instance.png)

# Schritt 2: User anlegen (OPTIONAL)

## Für Passwort Login muss ein neuer User angelegt werden

1. Links Benutzer auswählen und rechts Benutzer hinzufügen.
![create_user.png](img/create_user.png)

2. Hier nun den Username und ein Passwort eintragen. Danach auf speichern drücken.
![create_user_with_pw.png](img/create_user_with_pw.png)

# Schritt 3 mit Passwort: Login mit Passwort (Lokale Anmeldung)

1. Hier die IP von eurem ioBroker, Port, User und Passwort eintragen und den Button `Reconnect` drücken.
![app_login_first.png](img/app_login_first.png)

2. Danach unter Objekte den Datenpunkt `approved`, vom richtigen Geräte, auf true setzen (ohne den Haken Bestätigt)
![request_approved_wo_pw.png](img/request_approved_wo_pw.png)

3. Stimmt das Passwort oder der Username nicht wechselt der Datenpunkt wieder auf false und in der APP wird ein roter Text `Login declined` angezeigt. Bitte dann den Username und Passwort überprüfen und den Datenpunkt erneut auf true setzen.

4. Wurde alles richtig eingegeben erscheint nun einer grüner Text `Logged in`.
![app_login_with_pw.png](img/app_login_with_pw.png)
![approved_with_pw.png](img/approved_with_pw.png)

5. (Optional) Nun kann noch eine Weiterleitung eingetragen werden, damit man auch ausserhalb des Netzwerkes schalten kann. Zuvor muss die APP die Zugriffsrechte `Standort` erhalten. Dann das WLAN Netzwerk und die URL eintragen. Nun eine Weiterleitung in der Fritzbox einrichten. Das ist aber nicht zu empfehlen!! Besser wäre ein VPN Zugang. Z. Bsp. die APP `VpnCilla` verwenden (kostenpflichtig).
![app_access.png](img/app_access.png)![app_second_ip.png](img/app_second_ip.png)

# Schritt 3 ohne Passwort: Login mit Passwort (Lokale Anmeldung)

1. Hier den Haken bei `Use Passwort Login` entfernen und eure IP + Port vom ioBroker eintragen und den Button `Reconnect` drücken.
![app_login_first_wo_pw.png](img/app_login_first_wo_pw.png)

2. Den Datenpunkt `noPwdAllowed` auf true setzen (ohne den Haken Bestätigt) und dann den Datenpunkt `approved` auch auf true setzen (ohne den Haken Bestätigt).
![request_approved_wo_pw.png](img/request_approved_wo_pw.png)

3. Wurde alles richtig umgesetzt dann sollte es so aussehen.
![app_login_wo_pw_suc.png](img/app_login_wo_pw_suc.png)
![approved_wo_pw.png](img/approved_wo_pw.png)

# Wichtige Infos

- Möchte man einen User sperren dann einfach den Datenpunkt `approved` auf false setzen.
- In der View erscheint nun links oben ein grüner Haken wenn man Verbunden ist.
- Sollte dort ein rotes WLAN Zeichen blinken, dann kann keine Verbindung aufgebaut werden. Entweder befindet man sich nicht im selben Netzwerk oder der Datenpunkt `approved` steht auf false.
![app_connection_on.png](img/app_connection_on.png)
![app_connection_off.png](img/app_connection_off.png)

-   [Sichere Verbindung](secureCon.md)
-   [Einfache AES Verschlüsselung](aessecure.md)

-   [Zurück zur Beschreibung](/docs/de/README.md)
-   [Schritt 2: ENUMS erstellen](enum.md)
-   [Schritt 3: Widgets erstellen](widgets.md)
-   [Schritt 4: Screens erstellen](sreens.md)
-   [Schritt 5: Backups erstellen](backups.md)