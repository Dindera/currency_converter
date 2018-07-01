const  REPO = '/currency_converter';///currency_converter

// create a database 
const dbPromise = idb.open('currency_converter', 3, dbUpgrade =>{
    switch(dbUpgrade.oldVersion) {

    case 0:
    const countryStore = dbUpgrade.createObjectStore('countries', {keyPath: 'currencyName'} );

  case 1:
    const rateStore =  dbUpgrade.createObjectStore('rates', {keyPath: 'query'});
  
   
    }
  });


//Check for service worker update
const _updateReady = (worker) => {
            console.log('New Version Available');
             worker.postMessage({ action: 'skipWaiting' });
          
};

const _trackInstalling = (worker) => {
    worker.addEventListener('statechange', () => {
        if (worker.state === 'installed') {
             _updateReady(worker);
        }
    });
};

// register service worker
if ('serviceWorker' in navigator) {
    
    navigator.serviceWorker.register(REPO+'/sw.js', {scope: REPO+'/'}).then(reg => {

        if (reg.waiting) {
            _updateReady(reg.waiting);
            return;
        }
        if (reg.installing) {
            _trackInstalling(reg.installing);
            return;
        }
        reg.addEventListener('updatefound', () => {
            _trackInstalling(reg.installing);
        });
    }).catch(error => {
        console.log('fail', error);
    });
    // Refresh only once
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
}

//cA class to contain methods for getting countries and converting currencies

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
            }).then(function(results) {
                if (typeof results['results'] != "undefined") {
                    callback(results['results'])
                } else {
                    callback({'Error': 'Not found'});
                }
            }).catch(err => {
                dbPromise.then(db=>{
                    let countries = db.transaction('countries');
                   let  countriesStore = countries.objectStore('countries');
    
                    countriesStore.getAll().then(results => {
                        if (typeof results != "undefined") {
                            callback(results);
                        } else {
                            console.log(err);
                            callback(err);
                        
                    }   

            }); 
        })
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

                 dbPromise.then(db=>{
                let rates = db.transaction('rates', 'readwrite');
               let ratesStore = rates.objectStore('rates');
               json.query = query;
               console.log(json);
                ratesStore.put(json);
               });

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
        }).catch((err) => {   // catch the recieved rates in database when offline
            dbPromise.then(db => {
                let rates = db.transaction('rates');
                let ratesStore = rates.objectStore('rates');
                ratesStore.get(query).then(json => {
                    let val = json[query]['val'];
                    if (val) {
                        let total = val * amount;
                        callback(null, Math.round(total * 100) / 100);
                    } else {
                        let err = new Error("Value not found for " + query);
                        console.log(err);
                        callback(err);
                    }
                });
            });
        });
  }
}


  function convertAmount(conversionRate){
    const resultElement = document.getElementById('conversion');
    resultElement.innerText = "";
  
    const from = document.getElementById('from-currency').value;
    const to = document.getElementById('to-currency').value;
  
    const amount = parseFloat(document.getElementById('amount').value);
  
    conversionRate.convert(from, to, amount, (err, amount) => {
        // console.log(amount);
        // console.log(typeof amount);
        //console.log(json);
  
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
        // console.log('countryAbbreviations: ', countryAbbreviations);
  
        for (let el in elements) {
            for (let countryAbbreviation in countryAbbreviations) {
                
            dbPromise.then(db=>{  // store recieved data in the database
                let countries = db.transaction('countries', 'readwrite');
               let  countriesStore = countries.objectStore('countries');
                countriesStore.put(countryAbbreviations[countryAbbreviation]);
               });
                let option = document.createElement("option");
                option.text = `${countryAbbreviations[countryAbbreviation]['name']} - ${countryAbbreviations[countryAbbreviation]['currencyId']}`;
                option.value = countryAbbreviations[countryAbbreviation]['currencyId'];
                elements[el].add(option);
            }
        }
    });
  }



window.addEventListener('DOMContentLoaded', () => {
    let conversionRate = new FreeCurrencyConverter();

    // Populate currency fields
    populateCurrencyOptions(conversionRate);

    document.getElementById('convert-amount').addEventListener('click', () => {
        convertAmount(conversionRate);
    }, true);
}, true);