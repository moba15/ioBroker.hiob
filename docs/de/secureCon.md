# Sichere Verbindung

Du möchtest, dass deine Nachrichten zwischen den Adapter und deinem Handy verschlüsselt werden?

## Hinweis

Adapter version mind. auf 0.0.53-beta

## Ein Zertifikat erstellen

```bash
cd /opt/iobroker
mkdir cert
cd cert
openssl req -newkey rsa:4096 \
            -x509 \
            -sha256 \
            -days 3650 \
            -nodes \
            -out example.crt \
            -keyout example.key 
```

## Rechte vergeben

```bash
sudo chown iobroker example.crt
sudo chown iobroker example.key
```

## Einstellungen

- Auf dem IoBroker muss nun der Pfad zum key und cert eingeben werden. Anschließend kann der Hacken bei Use certificate Connection gesetzt werden
- In der App nun ebenfalls in den Einstellungen die Sichere verbindung aktivieren
