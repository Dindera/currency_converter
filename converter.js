import {convertAmount, populateCurrencyOptions }from './dist/coverterapi';
// import FreeCurrencyConverter
// import * as FreeCurrencyConverter from "./dist/coverterapi";
class FreeCurrencyConverter {
    
    constructor() {
        this.apiUrl = 'https://free.currencyconverterapi.com';
        this.countriesEndpoint = '/api/v5/countries';
        this.convertEndpoint = '/api/v5/convert';
    }
  
    getCountries(callback) {
        fetch(this.apiUrl + this.countriesEndpoint)
            .then(function(response) {
                return response.json();
            })
            .then(function(results) {
                if (typeof results['results'] != "undefined") {
                    callback(results['results'])
                } else {
                    callback({'Error': 'Not found'})
                }
            });
  
    }
  
    convert(fromCurrency, toCurrency, amount, callback){
        fromCurrency = encodeURIComponent(fromCurrency);
        toCurrency = encodeURIComponent(toCurrency);
        const query = `${fromCurrency}_${toCurrency}`;
        let url = `${this.apiUrl}${this.convertEndpoint}?q=${query}&compact=y`;
  
        fetch(url)
            .then(function(response) {
                return response.json();
            }).then(json => {
            console.log('RES',json);
            let val = json[query]['val'];
  
            if (val) {
                let total = val * amount;
                callback(null, Math.round(total * 100) / 100);
            }
            else {
                let err = new Error("Value not found for " + query);
                console.log(err);
                callback(err);
            }
        }).catch(err => {
            console.log("Parse error: ", err);
            callback(err);
        });
    }
  }



window.addEventListener('DOMContentLoaded', function() {
    let conversionRate = new FreeCurrencyConverter();

    // Populate currency fields
    populateCurrencyOptions(conversionRate);

    document.getElementById('convert-amount').addEventListener('click', function () {
        convertAmount(conversionRate);
    }, true);
}, true);