# Node.js Dockerized App

Diese Anleitung beschreibt, wie Sie eine Node.js-Anwendung mithilfe von Docker containerisieren können. Das Dockerfile setzt ein offizielles Node.js-Basisimage ein, kopiert die Anwendungsdateien in das Image und konfiguriert den Container so, dass er auf Port 3000 läuft.

## Voraussetzungen

- Docker muss auf Ihrem System installiert sein. Besuchen Sie [Docker Get Started](https://www.docker.com/get-started) für Installationsanleitungen.

## Projektstruktur

Ihr Projekt sollte mindestens folgende Dateien enthalten:

- `package.json` und `package-lock.json`: Konfigurationsdateien für Node.js-Projektabhängigkeiten.
- `app.js`: Der Hauptanwendungscode.
- `Dockerfile`: Das Dockerfile, basierend auf der Node.js-Basisimage, das Sie zum Erstellen Ihres Docker-Images verwenden.

## Docker-Image bauen

Führen Sie den folgenden Befehl im Wurzelverzeichnis Ihres Projekts aus, um Ihr Docker-Image zu erstellen. Ersetzen Sie `<tag>` durch einen geeigneten Tag für Ihr Image.

```bash
docker build -t finanze-explorer .
```

## Container starten

Nachdem das Image erfolgreich erstellt wurde, können Sie einen Container wie folgt starten:

```bash
docker run -p 3000:3000 finanze-explorer
```

Dieser Befehl startet einen Container Ihrer Anwendung und macht ihn über den Port 3000 auf Ihrem lokalen Host verfügbar.


## Zugriff auf die Anwendung

Nachdem der Container gestartet wurde, können Sie auf Ihre Node.js-Anwendung zugreifen, indem Sie http://localhost:3000 in Ihrem Webbrowser öffnen.


## Entwicklung und Wartung

- Um Änderungen an Ihrer Anwendung vorzunehmen, aktualisieren Sie die entsprechenden Dateien in Ihrem Projektverzeichnis und wiederholen Sie den Build- und Run-Prozess, um das aktualisierte Image zu erstellen und den Container neu zu starten.
- Nutzen Sie Docker-Volumes, um eine effiziente Entwicklungsumgebung zu gestalten, bei der Änderungen an Ihrem Code automatisch im laufenden Container reflektiert werden.


## Unterstützung

Wenn Sie auf Probleme stoßen oder Hilfe benötigen, überprüfen Sie bitte die Docker- und Node.js-Dokumentation oder erstellen Sie ein Issue in diesem Repository.


## Lizenz

Dieses Projekt ist Open Source und veröffentlicht unter der [MIT Lizenz](https://opensource.org/licenses/MIT).


