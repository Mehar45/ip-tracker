const ip = document.querySelector("#ip-address");
const userLocation = document.querySelector("#location");
const timezone = document.querySelector("#timezone");
const isp = document.querySelector("#isp");
const submitBtn = document.querySelector("form");

function url(searchIp, searchDomain) {
  if (searchIp == undefined && searchDomain == undefined) {
    return "https://geo.ipify.org/api/v2/country,city?apiKey=at_MZZAOcTwZnbsq8dxB6nJHq0jPoIe5";
  } else if (/[a-z.]$/.test(searchDomain)) {
    return `https://geo.ipify.org/api/v2/country,city?apiKey=at_MZZAOcTwZnbsq8dxB6nJHq0jPoIe5&domain=${searchDomain}`;
  } else {
    return `https://geo.ipify.org/api/v2/country,city?apiKey=at_MZZAOcTwZnbsq8dxB6nJHq0jPoIe5&ipAddress=${searchIp}`;
  }
}

async function userInfo(searchIp, searchDomain) {
  try {
    const reponse = await fetch(url(searchIp, searchDomain));
    const data = await reponse.json();
    ip.textContent = data.ip;
    userLocation.textContent = `${data.location.country}, ${data.location.region}`;
    timezone.textContent = `UTC ${data.location.timezone}`;
    isp.textContent = data.isp;
    return {
      lat: data.location.lat,
      lng: data.location.lng,
    };
  } catch {
    console.log("Something went wrong");
  }
}

// Map
let map = L.map("map");

function updateMap(data) {
  map.setView([data.lat, data.lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://opwnstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  const icon = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [30, 40],
  });

  L.marker([data.lat, data.lng], { icon }).addTo(map);
}

userInfo().then((data) => {
  updateMap(data);
});

submitBtn.addEventListener("submit", (e) => {
  e.preventDefault();
  if (submitBtn.typedinput.value !== "")
    userInfo(submitBtn.typedinput.value, submitBtn.typedinput.value).then(
      (data) => {
        updateMap(data);
      }
    );
  submitBtn.typedinput.value = "";
});
