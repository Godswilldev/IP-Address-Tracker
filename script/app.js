const form = document.querySelector(".form");
const IpAddresshtml = document.querySelector(".IpAddress");
const locationHtml = document.querySelector(".location");
const timezoneHtml = document.querySelector(".timezone");
const ispHtml = document.querySelector(".isp");

////////////// getting the location of the user to display the map
////////////////////////////////////////////////////////////////////

const displayMap = (lat, lng) => {
  let map = L.map("map").setView([lat, lng], 8);
  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution: "&copy;Greg",
  }).addTo(map);

  L.marker([lat, lng]).addTo(map);
};

navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude: lat } = position.coords;
    const { longitude: lng } = position.coords;
    let coords = [lat, lng];
    const loc = `https://www.google.com/maps/@${lat},${lng}`;
    displayMap(lat, lng);

    // let map = L.map("map").setView(coords, 8);

    // L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    //   attribution: "&copy;Greg",
    // }).addTo(map);

    // L.marker(coords).addTo(map);

    const apiKey = `pk.ab463a62a6fadeb5b2036f2d0edf7ab6`;
    const locationIq = ` https://eu1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lng}&format=json`;

    (async function getPreciseLocation() {
      try {
        const { data: location } = await axios.get(locationIq);
        locationHtml.textContent = location.display_name;
      } catch (error) {
        console.log(error);
      }
    })();
  },
  () => {
    console.log("couldn't get location");
  }
);

///////////////////////////////////////////////////////////////////////////////
///////////////////getting the Ip address on page load and displaying it
///////////////////////////////////////////////////////////////////////////////
const geoIpifyApiKey = "at_cKo17Jw64ZK7HmrIuVHmwufMSTOnm";

const ipAddressUrl = "https://ipinfo.io/json?token=f958fc223af431";
(async function getIpAddress() {
  try {
    const { data: IpAddressGotten } = await axios.get(ipAddressUrl);
    const geoIpAddess = `https://geo.ipify.org/api/v1?apiKey=${geoIpifyApiKey}&ipAddress=${IpAddressGotten.ip}`;

    const { data: ipdetails } = await axios.get(geoIpAddess);

    const { city, country, lat, lng, region, timezone } = ipdetails.location;

    IpAddresshtml.textContent = IpAddressGotten.ip;
    timezoneHtml.textContent = timezone;
    ispHtml.textContent = ipdetails.isp;
  } catch (error) {
    console.log(error);
  }
})();

////////////////////////////////
//handling form submission event
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const ipAddressInput = document.querySelector(".ip-address").value;
  const geoIpAddess = `https://geo.ipify.org/api/v1?apiKey=${geoIpifyApiKey}&ipAddress=${ipAddressInput}`;
  (async function fetchGeoLocation() {
    const { data } = await axios.get(geoIpAddess);
    const { ip, isp } = data;
    const { city, country, lat, lng, region, timezone } = data.location;
    console.log(ip, isp, city, country, lat, lng, region, timezone);
    IpAddresshtml.textContent = ip;
    timezoneHtml.textContent = timezone;
    ispHtml.textContent = isp;
    locationHtml.textContent = `${city} ${region}, ${country}`;

    ///////////////////////////
    ///update the map
    //////////////////////////
    var container = L.DomUtil.get("map");
    if (container != null) {
      container._leaflet_id = null;
    }
    displayMap(lat, lng);
  })();
});
