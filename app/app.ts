import Vue from 'vue';

//this does not filter specifically on city, as you can enter states and still return results. Based on the instructions - I will not add anything to restrict this to US cities.
const getWeatherByCity = (city) => `http://api.openweathermap.org/data/2.5/weather?appid=dc884d8347e8b27fc4bbbc265f2e9d3c&q=${city}`;

// =================================================== //
// Your code goes here.
 //possibly should break into different components -> but kept as one for simplicity
let App = Vue.extend({
    template: 
    `<div class="main">
        <div class="top">
            <h1>Weather</h1>
        </div>
        <div class="body">
            <form id="getWeather">
                <label for="cityInput">City</label>
                <input v-on:keyup="errValidator" v-bind:class="{'inputError': hasError}" type="text" v-model="cityInput" v-on:keydown.enter.prevent="getWeather(cityInput)"  name="cityInput"/>
                <p v-bind:class="{'errMessage': hasError}">{{errorMessage}}</p>
                <div class="text-right">
                <button @click="getWeather(cityInput)" type="button">Get Weather</button>
                </div>
            </form>
            <div class="bottom">
                <p><strong>Temp:</strong> {{temperature}}</p>
                <p><strong>Humidity:</strong> {{humidity}}</p>
            </div>
        </div>
    </div>`,
    data: function() {
        return {
            cityInput: '',
            errorMessage: '',
            temperature: '',
            humidity: '',
            hasError: false,
        }
    },
    methods: {
        getWeather(city) {
            if (city == ''){
                //throw error if input is empty
                this.errorMessage = "Please enter a city name";
                this.hasError = true;
            } else {
                //check if input is valid to pass to api, i.e. no numbers and special characters
                let valid = this.validate(city);
                if (valid) {
                    //remove any errors (if any) on form since valid
                    this.errorMessage = "";
                    this.hasError = false;
                    //for query string - replace spaces with %20
                    let cityQuery = city.replace(' ', '%20');
                    fetch(getWeatherByCity(cityQuery)).then(response => {
                        return response.json()
                    }).then(data => {
                        console.log(data);
                        //convert kelvin to imperial (fahrenheit), can add &unit=imperial to api url also
                        let kToF = Math.round(((data.main.temp - 273.15)*1.8)+32);
                        //if don't want degree symbol
                        this.temperature = (kToF).toString();
                        //if want degree symbol
                            // this.temperature = (kToF).toString() + "\xB0" + "F";
                        this.humidity = data.main.humidity.toString() + "%";
                        this.errorMessage = '';
                    }).catch(error => {
                        //if api returns 404 - set errors on form
                        this.errorMessage = "City not found";
                        this.hasError = true;
                    });
                } else {
                    // if user has entered numbers or anything outside of english alphabet - throw errors
                    this.errorMessage = "Please enter a valid city name";
                    this.hasError = true;
                }
            }
        },
        validate(input) {
            //doesn't validate anything outside of the english alphabet or special characters
            return (/^[a-zA-Z ]*$/g.test(input))
        },
        errValidator(e) {
            //remove error messages after user is entering text in input
            if (e.key !== "Enter") {
                this.errorMessage = "";
                this.hasError = false;
            }
        },
        preventSubmit(e) {
            //prevent form submission -> so page doesn't reload.
            if (e)
                e.preventDefault();
            console.log('prevented form submissions');
        }
    }

});
    new Vue({
        el: "#mount",
        components: { App },
    template: "<App/>"
});