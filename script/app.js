const form = document.querySelector(".form");
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

const IpAddresshtml = document.querySelector(".IpAddress");
const locationHtml = document.querySelector(".location");
const timezoneHtml = document.querySelector(".timezone");
const ispHtml = document.querySelector(".isp");

const ipAddressUrl = "https://api.ipify.org?format=json";
(async function getIpAddress() {
  try {
    const { data: IpAddressGotten } = await axios.get(ipAddressUrl);
    console.log(IpAddressGotten.ip);
    const api_key = "at_cKo17Jw64ZK7HmrIuVHmwufMSTOnm";
    const geoIpAddess = `https://geo.ipify.org/api/v1?apiKey=${api_key}&ipAddress=${IpAddressGotten.ip}`;

    const { data: ipdetails } = await axios.get(geoIpAddess);
    console.log(ipdetails);

    const { city, country, lat, lng, region, timezone } = ipdetails.location;
    console.log(city, country, lat, lng, region, timezone);

    IpAddresshtml.textContent = IpAddressGotten.ip;
    locationHtml.innerHTML = `<h1 class="heading__secondary result__value location">${city} <br /> ${region}, <br />${country}</h1>`;
    timezoneHtml.textContent = timezone;
    ispHtml.textContent = ipdetails.isp;
  } catch (error) {
    console.log(error);
  }
})();
