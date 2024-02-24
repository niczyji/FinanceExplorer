document.addEventListener("DOMContentLoaded", function () {
  const stocksDiv = document.getElementById("stocks");
  const metadataDiv = document.getElementById("metadata");
  const candlesDiv = document.getElementById("candles");

  fetch("data/exchange.json")
    .then((response) => response.json())
    .then((data) => {
      const stocksContainer = document.createElement("div");
      stocksContainer.innerHTML = "<h2>Aktien</h2>";

      const stocks = data.hits.hits.map((hit) => {
        const source = hit._source;
        return {
          name: source.name,
          symbol: source.symbol,
        };
      });

      stocks.sort((a, b) => a.name.localeCompare(b.name));

      stocks.forEach((stock) => {
        const stockItem = document.createElement("div");
        stockItem.className = "stock-item";
        stockItem.innerHTML = `<p><strong>${stock.name}</strong> (${stock.symbol})</p>`;
        stocksContainer.appendChild(stockItem);
      });

      stocksDiv.appendChild(stocksContainer);
    })
    .catch((error) =>
      console.error("Fehler beim Laden der Aktiendaten:", error)
    );

  fetch("data/metadata.json")
    .then((response) => response.json())
    .then((data) => {
      const metadataContainer = document.createElement("div");
      metadataContainer.className = "metadata-container";

      data.hits.hits.forEach((hit) => {
        const src = hit._source;

        // Prüfe, ob sharesStatistics existiert, bevor du darauf zugreifst
        const sharesOutstanding =
          src.sharesStatistics?.sharesOutstanding || "Nicht verfügbar";

        // Berechne den Aktienpreis, achte darauf, Division durch Null oder "Nicht verfügbar" zu vermeiden
        let aktienpreis = "Nicht verfügbar";
        if (typeof sharesOutstanding === "number" && sharesOutstanding > 0) {
          aktienpreis =
            (src.marketCapitalization.value / sharesOutstanding).toFixed(2) +
            " EUR";
        }

        const ul = document.createElement("ul");
        ul.className = "metadata-list";

        // Erstelle die Listenelemente mit den entsprechenden Informationen
        ul.innerHTML = `
          <li class="metadata-item"><div><strong>Name:</strong> ${
            src.name || "Nicht verfügbar"
          }</div>
          <div><strong>Aktienpreis:</strong> ${aktienpreis}</div></li>
          <li class="metadata-item"><div><strong>ISIN:</strong> ${
            src.isin || "Nicht verfügbar"
          }</div>
          <div><strong>Branche:</strong> ${
            src.gicSubIndustry || "Nicht verfügbar"
          }</div>
          <div><strong>Land:</strong> ${
            src.addressDetails?.country || "Nicht verfügbar"
          }</div></li>
          <li class="metadata-item"><div><strong>Marktkapitalisierung:</strong> ${formatMarketCap(
            src.marketCapitalization.value
          )}</div>
          <div><strong>KGV:</strong> ${
            src.highlights?.peRatio?.toFixed(2) || "Nicht verfügbar"
          }</div></li>
        `;

        // Hinzufügen des UL zum Container
        metadataContainer.appendChild(ul);
      });

      document.getElementById("metadata").appendChild(metadataContainer);
    })
    .catch((error) =>
      console.error("Fehler beim Laden der Metadatendaten:", error)
    );

  function formatMarketCap(value) {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + " Milliarden EUR";
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + " Millionen EUR";
    } else if (value > 0) {
      return value.toFixed(2) + " EUR";
    } else {
      return "Nicht verfügbar";
    }
  }

  fetch("data/candle.json")
    .then((response) => response.json())
    .then((data) => {
      const groupedData = {};
      data.hits.hits.forEach((hit) => {
        const source = hit._source;
        const symbol = source.symbol;
        if (!groupedData[symbol]) {
          groupedData[symbol] = [];
        }
        groupedData[symbol].push(source);
      });

      for (const symbol in groupedData) {
        const ctx = document.createElement("canvas");
        candlesDiv.appendChild(ctx);

        const labels = groupedData[symbol].map((entry) => entry.dateTime);
        const startPrices = groupedData[symbol].map(
          (entry) => entry.startPrice
        );
        const highestPrices = groupedData[symbol].map(
          (entry) => entry.highestPrice
        );
        const lowestPrices = groupedData[symbol].map(
          (entry) => entry.lowestPrice
        );
        const endPrices = groupedData[symbol].map((entry) => entry.endPrice);

        new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: `${symbol} - Startpreis`,
                borderColor: "rgba(255, 99, 132, 1)",
                data: startPrices,
                fill: false,
              },
              {
                label: `${symbol} - Höchstpreis`,
                borderColor: "rgba(54, 162, 235, 1)",
                data: highestPrices,
                fill: false,
              },
              {
                label: `${symbol} - Tiefstpreis`,
                borderColor: "rgba(75, 192, 192, 1)",
                data: lowestPrices,
                fill: false,
              },
              {
                label: `${symbol} - Endpreis`,
                borderColor: "rgba(153, 102, 255, 1)",
                data: endPrices,
                fill: false,
              },
            ],
          },
          options: {
            scales: {
              x: {
                display: true,
                title: {
                  display: true,
                  text: "Datum",
                },
              },
              y: {
                display: true,
                title: {
                  display: true,
                  text: "Preis",
                },
              },
            },
          },
        });
      }
    })
    .catch((error) =>
      console.error("Fehler beim Laden der Candle-Daten:", error)
    );
});
