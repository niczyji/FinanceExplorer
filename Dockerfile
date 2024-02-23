# Verwende ein offizielles Node.js Basis-Image
FROM node:14

# Setze das Arbeitsverzeichnis im Container
WORKDIR /usr/src/app

# Kopiere die package.json und package-lock.json Dateien
COPY package*.json ./

# Installiere die Projektabhängigkeiten
RUN npm install

# Kopiere den restlichen Quellcode des Projekts in das Arbeitsverzeichnis
COPY . .

# Mache den Port, auf dem die Anwendung läuft, nach außen hin verfügbar
EXPOSE 3000

# Starte die Anwendung
CMD ["node", "app.js"]
