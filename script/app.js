const form = document.querySelector(".form");
const IpAddresshtml = document.querySelector(".IpAddress");
const locationHtml = document.querySelector(".location");
const timezoneHtml = document.querySelector(".timezone");
const ispHtml = document.querySelector(".isp");

////////////// getting the location of the user to display the map
////////////////////////////////////////////////////////////////////

navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude: lat } = position.coords;
    const { longitude: lng } = position.coords;
    let coords = [lat, lng];

    var map = L.map("map").setView(coords, 7);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: "&copy;Greg",
    }).addTo(map);

    L.marker(coords).addTo(map);
  },
  () => {
    console.log("couldn't get location");
  }
);

///////////////////////////////////////////////////////////////////////////////
///////////////////getting the Ip address on page load and displaying it
///////////////////////////////////////////////////////////////////////////////

const ipAddressUrl = "https://ipinfo.io/json?token=f958fc223af431";
(async function getIpAddress() {
  try {
    const { data: IpAddressGotten } = await axios.get(ipAddressUrl);
    const api_key = "at_cKo17Jw64ZK7HmrIuVHmwufMSTOnm";
    const geoIpAddess = `https://geo.ipify.org/api/v1?apiKey=${api_key}&ipAddress=${IpAddressGotten.ip}`;

    const { data: ipdetails } = await axios.get(geoIpAddess);

    const { city, country, lat, lng, region, timezone } = ipdetails.location;

    IpAddresshtml.textContent = IpAddressGotten.ip;
    locationHtml.innerHTML = `<h1 class="heading__secondary result__value location">${city} <br /> ${region}, <br />${country}</h1>`;
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
});
