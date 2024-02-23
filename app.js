const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

const server = http.createServer(function(req, res) {
    // Bestimmen Sie den Pfad der angeforderten Ressource
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html'; // Standardseite
    }

    // Bestimmen Sie den MIME-Typ basierend auf der Dateierweiterung
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = {
        '.html': 'text/html',
        '.json': 'application/json',
    }[extname] || 'application/octet-stream'; // Standard-MIME-Typ

    fs.readFile(filePath, function(error, content) {
        if(error) {
            if(error.code == 'ENOENT') {
                // Datei nicht gefunden
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('Error: File Not Found');
            }
            else {
                // Anderer Fehler
                res.writeHead(500);
                res.end('Error: ' + error.code);
            }
        }
        else {
            // Erfolgreiches Laden der Datei
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(port, function(error) {
    if(error) {
        console.log('Something went wrong', error);
    } else {
        console.log('Server is listening on port ' + port);
    }
});
