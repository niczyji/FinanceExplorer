document.addEventListener("DOMContentLoaded", function () {
  const stocksDiv = document.getElementById("stocks");
  const metadataContainer = document.getElementById("metadata");
  const candlesDiv = document.getElementById("candles");

  fetch("data/exchange.json")
    .then((response) => response.json())
    .then((data) => {
      const exchangeList = document.createElement("ul"); // Erstellen eines UL-Elements für die Liste
      exchangeList.className = "exchange-list"; // Zuweisung der Klasse für die Liste

      const stocks = data.hits.hits.map((hit) => {
        const source = hit._source;
        return {
          name: source.name,
          symbol: source.symbol,
          type: source.type,
        };
      });

      stocks.sort((a, b) => a.name.localeCompare(b.name));

      stocks.forEach((stock) => {
        const exchangeItem = document.createElement("li"); // Erstelle ein LI-Element für jedes Element
        exchangeItem.className = "exchange-item"; // Zuweisung der Klasse für das Element
        exchangeItem.innerHTML = `
        <div><strong>Name:</strong> ${stock.name}</div>
        <div><strong>Symbol:</strong> ${stock.symbol}</div>
        <div><strong>Typ:</strong> ${stock.type}</div>`;
        exchangeList.appendChild(exchangeItem); // Hinzufügen des LI-Elements zum UL
      });

      stocksDiv.appendChild(exchangeList); // Hinzufügen des UL-Elements zum Container
      document.getElementById("stocksDiv").appendChild(stocksDiv); // Annahme, dass es ein Element mit der ID 'stocksDiv' gibt
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

        const sharesOutstanding =
          src.sharesStatistics?.sharesOutstanding || "Nicht verfügbar";
        let aktienpreis = "Nicht verfügbar";
        if (typeof sharesOutstanding === "number" && sharesOutstanding > 0) {
          aktienpreis =
            (src.marketCapitalization.value / sharesOutstanding).toFixed(2) +
            " EUR";
        }

        const week52High = src.technicals?.["52WeekHigh"] || "Nicht verfügbar";
        const week52Low = src.technicals?.["52WeekLow"] || "Nicht verfügbar";

        let content = ""; // Initialisiere den Inhalt basierend auf dem Typ

        switch (src.type) {
          case "common stock":
            content = `
              <li class="metadata-item">
                <div><strong>Name:</strong> ${
                  src.name || "Nicht verfügbar"
                }</div>
                <div><strong>Typ:</strong> ${"Aktie" || "Nicht verfügbar"}</div>
                <div><strong>Aktienpreis:</strong> ${aktienpreis}</div>
                <div><strong>52-Wochen-Spanne:</strong> ${formatCurrency(
                  week52Low
                )} - ${formatCurrency(week52High)}</div>
                <div><strong>Marktkapitalisierung:</strong> ${formatMarketCap(
                  src.marketCapitalization.value
                )}</div>
              </li>
              <li class="metadata-item">
                <div><strong>ISIN:</strong> ${
                  src.isin || "Nicht verfügbar"
                }</div>
                <div><strong>Branche:</strong> ${
                  src.gicSubIndustry || "Nicht verfügbar"
                }</div>
                <div><strong>Land:</strong> ${
                  src.addressDetails?.country || "Nicht verfügbar"
                }</div>
                <div><strong>KGV:</strong> ${
                  src.highlights?.peRatio?.toFixed(2) || "Nicht verfügbar"
                }</div>
              </li>
            `;
            break;
          case "cryptocurrency":
            content = `
                  <li class="metadata-item">
                    <div><strong>Name:</strong> ${
                      src.name || "Nicht verfügbar"
                    }</div>
                    <div><strong>Typ:</strong> ${
                      src.type || "Nicht verfügbar"
                    }</div>
                    <div><strong>Preis:</strong> ${
                      src.price
                        ? formatCurrency(src.price, src.currency) +
                          " " +
                          src.currency
                        : "Nicht verfügbar"
                    }</div>
                    <div><strong>Marktkapitalisierung:</strong> ${
                      src.marketCapitalization && src.marketCapitalization.value
                        ? formatMarketCap(src.marketCapitalization.value) +
                          " " +
                          src.currency
                        : "Nicht verfügbar"
                    }</div>
                    <div><strong>Volumen:</strong> ${
                      src.volume
                        ? src.volume.toLocaleString("de-DE") + " Einheiten"
                        : "Nicht verfügbar"
                    }</div>
                    <div><strong>Webseite:</strong> <a href="${
                      src.webUrl
                    }" target="_blank">${src.webUrl}</a></div>
                  </li>
              `;
            break;
          case "exchange traded commodity":
            content = `
                <li class="exchange-item">
                  <div><strong>Name:</strong> ${
                    src.name || "Nicht verfügbar"
                  }</div>
                  <div><strong>Typ:</strong> ${
                    src.type || "Nicht verfügbar"
                  }</div>
                  <div><strong>ISIN:</strong> ${
                    src.isin || "Nicht verfügbar"
                  }</div>
                  <div><strong>Total Assets:</strong> ${
                    src.exchangeTradedFundDetails?.totalAssets.toLocaleString(
                      "de-DE"
                    ) || "Nicht verfügbar"
                  } EUR</div>
                  <div><strong>52-Wochen-Spanne:</strong> ${formatCurrency(
                    src.technicals?.["52WeekLow"]
                  )} - ${formatCurrency(src.technicals?.["52WeekHigh"])}</div>
                  <div><strong>1Y Volatility:</strong> ${
                    src.exchangeTradedFundDetails?.performance[
                      "1YVolatility"
                    ] || "Nicht verfügbar"
                  }%</div>
                  <div><strong>3Y Volatility:</strong> ${
                    src.exchangeTradedFundDetails?.performance[
                      "3YVolatility"
                    ] || "Nicht verfügbar"
                  }%</div>
                  <div><strong>3Y Expected Return:</strong> ${
                    src.exchangeTradedFundDetails?.performance["3YExpReturn"] ||
                    "Nicht verfügbar"
                  }%</div>
                  <div><strong>3Y Sharpe Ratio:</strong> ${
                    src.exchangeTradedFundDetails?.performance[
                      "3YSharpRatio"
                    ] || "Nicht verfügbar"
                  }</div>
                  <div><strong>Returns YTD:</strong> ${
                    src.exchangeTradedFundDetails?.performance["returnsYtd"] ||
                    "Nicht verfügbar"
                  }%</div>
                  <div><strong>Returns 1Y:</strong> ${
                    src.exchangeTradedFundDetails?.performance["returns1Y"] ||
                    "Nicht verfügbar"
                  }%</div>
                  <div><strong>Returns 3Y:</strong> ${
                    src.exchangeTradedFundDetails?.performance["returns3Y"] ||
                    "Nicht verfügbar"
                  }%</div>
                  <div><strong>Returns 5Y:</strong> ${
                    src.exchangeTradedFundDetails?.performance["returns5Y"] ||
                    "Nicht verfügbar"
                  }%</div>
                  <div><strong>Returns 10Y:</strong> ${
                    src.exchangeTradedFundDetails?.performance["returns10Y"] ||
                    "Nicht verfügbar"
                  }%</div>
                </li>
              `;
            break;
          case "fund":
            content = `
                <li class="metadata-item">
                  <div><strong>Name:</strong> ${
                    src.name || "Nicht verfügbar"
                  }</div>
                  <div><strong>Typ:</strong> ${
                    src.type || "Nicht verfügbar"
                  }</div>
                  <div><strong>ISIN:</strong> ${
                    src.isin || "Nicht verfügbar"
                  }</div>
                  <div><strong>Marktkapitalisierung:</strong> ${
                    src.marketCap
                      ? formatMarketCap(src.marketCap)
                      : "Nicht verfügbar"
                  }</div>
                  <div><strong>Handelsvolumen:</strong> ${
                    src.volume
                      ? src.volume.toLocaleString("de-DE") + " Stück"
                      : "Nicht verfügbar"
                  }</div>
                  <div><strong>Preis:</strong> ${
                    src.price
                      ? src.price.toFixed(2) + " EUR"
                      : "Nicht verfügbar"
                  }</div>
                  <div><strong>52-Wochen-Spanne:</strong> ${
                    src.week52Range ? src.week52Range : "Nicht verfügbar"
                  }</div>
                </li>
              `;
            break;
          case "index":
            // Das ISIN-Feld ist vorhanden, WKN-Feld fehlt im bereitgestellten Beispiel
            const indexComponentsCount = src.indexComponents
              ? src.indexComponents.length
              : "Nicht verfügbar";
            content = `
                  <li class="metadata-item">
                    <div><strong>Name:</strong> ${
                      src.name || "Nicht verfügbar"
                    }</div>
                    <div><strong>Typ:</strong> ${
                      src.type || "Nicht verfügbar"
                    }</div>
                    <div><strong>Anzahl der Indexkomponenten:</strong> ${indexComponentsCount}</div>
                  </li>
                `;
            break;
          case "mutual fund":
            content = `
                  <li class="metadata-item">
                    <div><strong>Name:</strong> ${
                      src.name || "Nicht verfügbar"
                    }</div>
                    <div><strong>Typ:</strong> ${
                      src.type || "Nicht verfügbar"
                    }</div>
                    <div><strong>ISIN:</strong> ${
                      src.isin || "Nicht verfügbar"
                    }</div>
                    <div><strong>Marktkapitalisierung:</strong> ${
                      src.marketCapitalization && src.marketCapitalization.value
                        ? formatMarketCap(src.marketCapitalization.value)
                        : "Nicht verfügbar"
                    }</div>
                    <div><strong>Handelsvolumen:</strong> ${
                      src.volume
                        ? src.volume.toLocaleString("de-DE") + " Stück"
                        : "Nicht verfügbar"
                    }</div>
                    <div><strong>Preis:</strong> ${
                      src.price ? formatCurrency(src.price) : "Nicht verfügbar"
                    }</div>
                    <div><strong>52-Wochen-Spanne:</strong> ${
                      src.week52Range || "Nicht verfügbar"
                    }</div>
                    <div><strong>Ertragsrate:</strong> ${
                      src.mutualFundDetails.yield
                        ? (src.mutualFundDetails.yield * 100).toFixed(2) + "%"
                        : "Nicht verfügbar"
                    }</div>
                    <div><strong>Ertragsrate YTD:</strong> ${
                      src.mutualFundDetails.yieldYtd
                        ? (src.mutualFundDetails.yieldYtd * 100).toFixed(2) +
                          "%"
                        : "Nicht verfügbar"
                    }</div>
                    <div><strong>Ertragsrate 1 Jahr YTD:</strong> ${
                      src.mutualFundDetails.yield1YearYtd
                        ? src.mutualFundDetails.yield1YearYtd.toFixed(2) + "%"
                        : "Nicht verfügbar"
                    }</div>
                    <div><strong>Ertragsrate 3 Jahre YTD:</strong> ${
                      src.mutualFundDetails.yield3YearYtd
                        ? src.mutualFundDetails.yield3YearYtd.toFixed(2) + "%"
                        : "Nicht verfügbar"
                    }</div>
                    <div><strong>Ertragsrate 5 Jahre YTD:</strong> ${
                      src.mutualFundDetails.yield5YearYtd
                        ? src.mutualFundDetails.yield5YearYtd.toFixed(2) + "%"
                        : "Nicht verfügbar"
                    }</div>
                    <div><strong>NAV:</strong> ${
                      src.mutualFundDetails.nav
                        ? formatCurrency(parseFloat(src.mutualFundDetails.nav))
                        : "Nicht verfügbar"
                    }</div>
                    <div><strong>Vorheriger Schlusskurs:</strong> ${
                      src.mutualFundDetails.prevClosePrice
                        ? formatCurrency(
                            parseFloat(src.mutualFundDetails.prevClosePrice)
                          )
                        : "Nicht verfügbar"
                    }</div>
                  </li>
              `;
            break;
          case "exchange traded fund":
            if (src.exchangeTradedFundDetails) {
              const etfDetails = src.exchangeTradedFundDetails;
              content = `
                <li class="metadata-item">
                  <div><strong>Name:</strong> ${
                    src.name || "Nicht verfügbar"
                  }</div>
                  <div><strong>Typ:</strong> ${
                    src.type || "Nicht verfügbar"
                  }</div>
                  <div><strong>ISIN:</strong> ${
                    src.isin || "Nicht verfügbar"
                  }</div>
                  <div><strong>Ticker:</strong> ${
                    src.ticker || "Nicht verfügbar"
                  }</div>
                  <div><strong>Fondsgröße:</strong> ${
                    etfDetails.totalAssets
                      ? etfDetails.totalAssets.toLocaleString("de-DE") + " EUR"
                      : "Nicht verfügbar"
                  }</div>
                  <div><strong>TER:</strong> ${
                    etfDetails.ongoingCharge
                      ? etfDetails.ongoingCharge + "%"
                      : "Nicht verfügbar"
                  }</div>
                  <div><strong>Anzahl Positionen:</strong> ${
                    etfDetails.holdingsCount || "Nicht verfügbar"
                  }</div>
                </li>
              `;
            } else {
              content = `
              <li class="metadata-item">
              <div><strong>Name:</strong> ${src.name || "Nicht verfügbar"}</div>
              <div><strong>Typ:</strong> ${src.type || "Nicht verfügbar"}</div>
            </li>
              `;
            }
            break;
          default:
            // Falls Typ nicht erkannt wird oder nicht gelistet ist
            content = `
            <li class="metadata-item">
            <div><strong>Name:</strong> ${src.name || "Nicht verfügbar"}</div>
            <div><strong>Typ:</strong> ${src.type || "Nicht verfügbar"}</div>
          </li>
            `;
            break;
        }

        const ul = document.createElement("ul");
        ul.className = "metadata-list";
        ul.innerHTML = content;

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

  function formatCurrency(value, currency = "EUR") {
    if (typeof value === "number") {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: currency,
      }).format(value);
    }
    return "Nicht verfügbar";
  }

  // Stellen Sie sicher, dass Sie eine entsprechende Funktion zur Formatierung von Währungswerten haben
  function formatCurrency(value) {
    // Diese Funktion formatiert numerische Werte als Währung
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(value);
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
