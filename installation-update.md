---
description: 'Frage Stellung: Wie installiert man HioB?'
---

# Installation/Update

## Installation des Adapters:

Der Adapter befindet sich noch nicht offizielen ioBroker-Repository, weshalb die Installation manuell durchgeführt werden muss:

<details>

<summary>Befehl für die Installation der Final Version:</summary>

<pre class="language-bash"><code class="lang-bash"><strong>cd /opt/iobroker #Teilweise nicht benötigt
</strong>npm install iobroker.hiob #Installation über das NPM Repository
iobroker add hiob #Hinzufügen einer neuen HioB instanz
</code></pre>

</details>

<details>

<summary>Befehl um den Adapter zu updaten:</summary>

```bash
cd /opt/iobroker #Teilweise nicht benötigt
npm install iobroker.hiob #Installation über das NPM Repository
iobroker restart hiob #Instanz neustarten
```

</details>

<details>

<summary>Update  auf die Beta Version</summary>

Hinweis: Diese Version könnte sehr instabil sein und ist meistens noch stark in der Entwicklung!

```bash
cd /opt/iobroker #Teilweise nicht benötigt
npm install iobroker.hiob@0.0.31-beta.1 #Installation über das NPM Repository
iobroker restart hiob #Instanz neustarten
```

</details>

### Einrichtung des Adapter

Nach der Installation kann über die Einstellung der Instanz der verwendete Port eingestellt werden

## Installation der Android App

Die Installation kann normal über den PlayStore stattfinden: [https://play.google.com/store/apps/details?id=de.bachmaier.smart\_home](https://play.google.com/store/apps/details?id=de.bachmaier.smart\_home)&#x20;

Open Beta: Anmeldung über den PlayStore

Closed Beta: Email an hiob@bachmaiers.de mit der Verwendeten PlayStore Email
