const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchForm = document.querySelector("[data-searchform]");
const searchInput = document.querySelector("[data-searchInput]");
const grantAccessContainer  = document.querySelector(".grant-location-container");
const grantAccessButton = document.querySelector("[data-grantAccess]");
const loadingScreen = document.querySelector(".loading-container");
// const userContainer = document.querySelector(".weather-container");
const userInfoContainer = document.querySelector(".user-info-container");

const API_KEY = "c6f326122a2f1c6c25569d1a227f8f5b";
let oldTab = userTab;
oldTab.classList.add("current-tab");
getFromBrowserStorage();

userTab.addEventListener("click", ()=> {
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=> {
    switchTab(searchTab);
});

function switchTab(newTab) {

    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");
    }
    //searchTab//
    if(!searchForm.classList.contains("active")){
        grantAccessContainer.classList.remove("active");
        userInfoContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    //userTab//
    else {
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getFromBrowserStorage();
    }
}

function getFromBrowserStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchInfo(coordinates);
    }
}
// // if localcoordinates are not present in getfrombrowserstorage we are enabling grantaccesscontainer//
// // in grant access container we are proving grant access button which will fetch out latitude and 
// // longitude and send it back to browser storage//

grantAccessButton.addEventListener("click", getlocation);
//location finding//
function getlocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(currentPosition);
    }
    else {

    }

    function currentPosition(position) {
        // creating an object and storing user cooridnates//
        const userCoordinates = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
        }
        sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
        fetchInfo(userCoordinates);
    }
}

//doing api call using try and catch//

async function fetchInfo(coordinates) {
    const {lat, lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //api call//

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        
    }
    catch {
        loadingScreen.classList.remove("active");
    }
}

function renderWeatherInfo(apidata) {

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    console.log(apidata);

    //fetch values from apidata object and put it UI elements
    cityName.innerText = apidata?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${apidata?.sys?.country.toLowerCase()}.png`;
    desc.innerText = apidata?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${apidata?.weather?.[0]?.icon}.png`;
    temp.innerText = `${apidata?.main?.temp} °C`;
    windspeed.innerText = `${apidata?.wind?.speed} m/s`;
    humidity.innerText = `${apidata?.main?.humidity}%`;
    cloudiness.innerText = `${apidata?.clouds?.all}%`;

}


//when tab is changed from userTab to Search Tab//

searchForm.addEventListener("submit", (e)=> {
    e.preventDefault();

    let cityName = searchInput.value;

    if(cityName === "") 
        return;
    else 
        fetchSearchWeatherInfo(cityName);
});

//api call//

async function fetchSearchWeatherInfo(city) {

    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

   //Api call//
   try {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
   }
   catch {
    
   }
}