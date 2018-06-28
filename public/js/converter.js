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

  function convertAmount(conversionRate){
    let resultElement = document.getElementById('conversion');
    resultElement.innerText = "";
  
    let from = document.getElementById('from-currency').value;
    let to = document.getElementById('to-currency').value;
  
    let amount = parseFloat(document.getElementById('amount').value);
  
    conversionRate.convert(from, to, amount, (err, amount) => {
        console.log(amount);
        console.log(typeof amount);
  
  
        if (amount <= 0 || isNaN(amount)) {
            amount = '0.00';
        }
  
        resultElement.innerText = `${to} ${amount}`;
    });
  }
  
  
  function populateCurrencyOptions(conversionRate){
  
    let elements = [
        document.getElementById('from-currency'),
        document.getElementById('to-currency')
    ];
  
    conversionRate.getCountries((countryAbbreviations) => {
        console.log('countryAbbreviations: ', countryAbbreviations);
  
        for (let el in elements) {
            for (let countryAbbreviation in countryAbbreviations) {
                let option = document.createElement("option");
                option.text = `${countryAbbreviations[countryAbbreviation]['name']} - ${countryAbbreviations[countryAbbreviation]['currencyId']}`;
                option.value = countryAbbreviations[countryAbbreviation]['currencyId'];
                elements[el].add(option);
            }
        }
    })
  }



window.addEventListener('DOMContentLoaded', function() {
    let conversionRate = new FreeCurrencyConverter();

    // Populate currency fields
    populateCurrencyOptions(conversionRate);

    document.getElementById('convert-amount').addEventListener('click', function () {
        convertAmount(conversionRate);
    }, true);
}, true);