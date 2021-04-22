const form = document.querySelector(".form");
const IpAddresshtml = document.querySelector(".IpAddress");
const locationHtml = document.querySelector(".location");
const timezoneHtml = document.querySelector(".timezone");
const ispHtml = document.querySelector(".isp");

const addLoadingIcon = () => {
  document.querySelector("#loader").style.display = "block";
  document.querySelector("#loader").style.opacity = 1;
  document.querySelector("#loader").style.visibility = "visible";
  document.querySelector(".loading").style.display = "block";
  document.querySelector(".loading").style.opacity = 1;
  document.querySelector(".loading").style.visibility = "visible";
};

const removeLoadingIcon = () => {
  document.querySelector("#loader").style.display = "none";
  document.querySelector("#loader").style.opacity = 0;
  document.querySelector("#loader").style.visibility = "hidden";
  document.querySelector(".loading").style.display = "none";
  document.querySelector(".loading").style.opacity = 0;
  document.querySelector(".loading").style.visibility = "hidden";
};

////////////// getting the location of the user to display the map
////////////////////////////////////////////////////////////////////

const displayMap = (lat, lng) => {
  // let map = L.map("map").setView([lat, lng], 8);
  var map = L.map("map", {
    center: [lat, lng],
    zoom: 8,
    dragging: true,
    doubleClickZoom: true,
    zoomDelta: 8.5,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
    attribution: "&copy;Greg",
  }).addTo(map);

  L.marker([lat, lng]).addTo(map);
};

navigator.geolocation.getCurrentPosition(
  (position) => {
    addLoadingIcon();
    const { latitude: lat } = position.coords;
    const { longitude: lng } = position.coords;
    let coords = [lat, lng];
    const loc = `https://www.google.com/maps/@${lat},${lng}`;
    displayMap(lat, lng);

    const apiKey = `pk.ab463a62a6fadeb5b2036f2d0edf7ab6`;
    const locationIq = ` https://eu1.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lng}&format=json`;

    (async function getPreciseLocation() {
      try {
        const { data: location } = await axios.get(locationIq);
        locationHtml.textContent = location.display_name;
        removeLoadingIcon();
      } catch (error) {
        console.log(error);
        removeLoadingIcon();
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
  const ipAddressInput = document.querySelector(".ip-address").value.trim();

  if (ipAddressInput === "") {
    alert("Enter a valid Ip address");
  } else {
    const geoIpAddess = `https://geo.ipify.org/api/v1?apiKey=${geoIpifyApiKey}&ipAddress=${ipAddressInput}`;

    (async function fetchGeoLocation() {
      addLoadingIcon();
      try {
        const { data } = await axios.get(geoIpAddess);

        const { ip, isp } = data;
        const { city, country, lat, lng, region, timezone } = data.location;
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
          displayMap(lat, lng);
        }
        document.querySelector(".ip-address").value = "";
        removeLoadingIcon();
      } catch (error) {
        alert("Invalid Ip Address");
        document.querySelector(".ip-address").value = "";
        removeLoadingIcon();
      }
    })();
  }
});
