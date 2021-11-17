var xhttp = new XMLHttpRequest();
xhttp.open(
  "GET",
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd",
  false
);
xhttp.send(null);
var data = JSON.parse(xhttp.responseText);

console.log(data[0]);

var cryptocurrencies;
var timerID;
var updateInterval = 30000;

function descending(a, b) {
  return a.percentage_change_24h < b.percentage_change_24h ? 1 : -1;
}
function ascending(a, b) {
  return a.percentage_change_24h > b.percentage_change_24h ? 1 : -1;
}

function reposition() {
  var height = $("#cryptocurrencies .cryptocurrency").height();
  var y = height;
  for (var i = 0; i < cryptocurrencies.length; i++) {
    cryptocurrencies[i].$item.css("top", y + "px");
    y += height;
  }
}

function updateRanks(cryptocurrencies) {
  for (var i = 0; i < cryptocurrencies.length; i++) {
    cryptocurrencies[i].$item.find(".rank").text(i + 1);
  }
}

// function getRandomScoreIncrease() {
//     return getRandomBetween(10, 20);
// }

// function getRandomBetween(min, max) {
//     return Math.floor(Math.random() * max) + min;
// }

function fetchNewData(data, attributeName, name) {
  for (var x in data) {
    if ((data[x].name == name) == true) {
      return data[x][attributeName];
    }
  }
  return null;
}

function getNewData() {
  var newXhttp = new XMLHttpRequest();
  newXhttp.open(
    "GET",
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd",
    false
  );
  newXhttp.send(null);

  var newdata = JSON.parse(newXhttp.responseText);

  for (var i = 0; i < cryptocurrencies.length; i++) {
    var cryptocurrency = cryptocurrencies[i];
    cryptocurrency.volume_24h = fetchNewData(
      newdata,
      "total_volume",
      cryptocurrency.name
    );
    cryptocurrency.$item
      .find(".volume_24h")
      .text(Number(cryptocurrency.volume_24h).toFixed(2));
    cryptocurrency.price = fetchNewData(
      newdata,
      "current_price",
      cryptocurrency.name
    );
    cryptocurrency.$item
      .find(".price")
      .text(Number(cryptocurrency.price).toFixed(2));
    cryptocurrency.price_percentage = fetchNewData(
      newdata,
      "price_change_percentage_24h",
      cryptocurrency.name
    );
    cryptocurrency.$item
      .find(".price_percentage")
      .text(Number(cryptocurrency.price_percentage).toFixed(2));
    cryptocurrency.percentage_change_24h = fetchNewData(
      newdata,
      "market_cap_change_percentage_24h",
      cryptocurrency.name
    );
    cryptocurrency.$item
      .find(".percentage_change_24h")
      .text(Number(cryptocurrency.percentage_change_24h).toFixed(2));
    // cryptocurrency.percentage_change_24h += getRandomScoreIncrease();
    // cryptocurrency.$item.find(".percentage_change_24h").text(cryptocurrency.percentage_change_24h);
  }
  cryptocurrencies.sort(descending);
  updateRanks(cryptocurrencies);
  reposition();
  console.log("Succesfully fetched new Data!");
}

function resetBoard() {
  var $list = $("#cryptocurrencies");
  $list.find(".cryptocurrency").remove();

  if (timerID !== undefined) {
    clearInterval(timerID);
  }

  cryptocurrencies = [];
  for (let i = 0; i < 100; i++) {
    cryptocurrencies.push({
      name: data[i].name,
      symbol: data[i].symbol,
      price: Number(data[i].current_price).toFixed(2),
      price_percentage: Number(data[i].price_change_percentage_24h).toFixed(2),
      market_cap: Number(data[i].market_cap).toFixed(2),
      circulating_supply: Number(
        Math.round(data[i].circulating_supply)
      ).toFixed(2),
      volume_24h: Number(data[i].total_volume).toFixed(2),
      percentage_change_24h: Number(
        data[i].market_cap_change_percentage_24h
      ).toFixed(2),
    });
  }

  for (var i = 0; i < cryptocurrencies.length; i++) {
    var $item = $(
      "<tr class='cryptocurrency'>" +
        "<td class='rank' >" +
        (i + 1) +
        "</td >" +
        "<td class='name' >" +
        cryptocurrencies[i].name +
        "</td >" +
        "<td class= 'symbol' >" +
        cryptocurrencies[i].symbol +
        "</td >" +
        "<td class='price' >" +
        cryptocurrencies[i].price +
        "</td >" +
        "<td class='price_percentage_change_24h' >" +
        cryptocurrencies[i].price_percentage +
        "</td >" +
        "<td class= 'market_cap' >" +
        cryptocurrencies[i].market_cap +
        "</td >" +
        "<td class='circulating_supply' >" +
        cryptocurrencies[i].circulating_supply +
        "</td>" +
        "<td class= 'volume_24h' >" +
        cryptocurrencies[i].volume_24h +
        "</td>" +
        "<td class='percentage_change_24h' >" +
        cryptocurrencies[i].percentage_change_24h +
        "</td>" +
        "</tr>"
    );
    cryptocurrencies[i].$item = $item;
    $list.append($item);
  }
  timerID = setInterval("getNewData();", updateInterval);
}
resetBoard();
