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
      metadataContainer.innerHTML = "<h2>Metadaten</h2>";

      const metadata = data.hits.hits.map((hit) => {
        const source = hit._source;
        return {
          name: source.name,
          symbol: source.symbol,
        };
      });

      metadata.sort((a, b) => a.name.localeCompare(b.name));

      metadata.forEach((meta) => {
        const metadataItem = document.createElement("div");
        metadataItem.className = "metadata-item";
        metadataItem.innerHTML = `<p><strong>${meta.name}</strong> (${meta.symbol})</p>`;
        metadataContainer.appendChild(metadataItem);
      });

      metadataDiv.appendChild(metadataContainer);
    })
    .catch((error) =>
      console.error("Fehler beim Laden der Metadatendaten:", error)
    );

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
