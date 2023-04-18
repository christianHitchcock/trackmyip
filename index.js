const API =  "https://geo.ipify.org/api/v2/country,city?apiKey=at_h9y1lbZRSb8yy0r45N0C2lNE2aqX5&";





// checking the api response 

async function checkRes(res) { 
	if(res.ok) 
		return res.json();
	
	/* throw the error */
	const err = await res.json();
	throw new Error(err.messages);
};

async function fetchData(queryType, queryValue) {	
	
	/* If there's no query, load user ip location*/
	const requestString = !queryType 
		? API  : `${API}&${queryType}=${queryValue}`;

	return await 
		fetch(requestString)
			.then(checkRes)
			.then(data => data)

			.catch(err => {
				console.error(err);
				alert('Something went wrong.');
			});
}

/* Fetch query can be made with either an ipAddress or a domain */
async function mainPage (queryType, queryValue) {
	const data = await fetchData(queryType, queryValue);
    
	displayUserdata(data);
    setMap(data.location.lat, data.location.lng);  
};

function displayUserdata({ ip, location, isp }) {
	const [ IP, Location, TimeZone, ISP ] = document.getElementsByClassName('data-value');

	IP.innerText = ip;
	Location.innerText = `${location.region}, ${location.country} ${location.postalCode}`;
	TimeZone.innerText = 'UTC ' + location.timezone;
	ISP.innerText = isp;
}

document.addEventListener('DOMContentLoaded', () => {
	mainPage();
	document.querySelector('form').onsubmit = handleSubmit;
});

function handleSubmit(e) {
	e.preventDefault();


	const input = document.querySelector('.input');

//  use regex to get the correct input format
	const ipRegExp = RegExp(`(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}`);
	const domainRegExp = RegExp(`^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,6}$`);

	/* check whether input is an ip-address or a domain-name or an invalid input */
	if (ipRegExp.test(input.value)) {
		mainPage('ipAddress', input.value);
	}
	else if (domainRegExp.test(input.value)) {
		mainPage('domain', input.value);
	}
	else {
		alert('Please enter a domain name or an ip address.');
	}
}

function setMap(lat,lng) {
   
    
    var container = L.DomUtil.get('map');
      if(container != null){
        container._leaflet_id = null;
      }


  
	let map = L.map('map').setView([ lat, lng ], 7);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    var myIcon = L.icon({
        iconUrl:"../images/icon-location.svg",
        iconSize: [35, 55],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],  
    });
    
    
    L.marker([ lat, lng ], { icon: myIcon }).addTo(map);
}