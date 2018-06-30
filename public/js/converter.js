
const dbPromise = idb.open('currency_converter', 3, dbUpgrade =>{
    switch(dbUpgrade.oldVersion) {
    //   case 0:
    //    dbUpgrade.createObjectStore('countries', {keyPath: 'currencyName'});

    //    case 1: 
    //       const countryStore = dbUpgrade.transaction.objectStore('countries');
    //       countryStore.createIndex('country', 'currencyName');
    //       countryStore.createIndex('country_code', 'currencyId');
   
    //   case 2:
    //   dbUpgrade.createObjectStore('rates', {keyPath: 'query'});
    // //   const rateStore = dbUpgrade.transaction.objectStore('rates')
    // //    const rateStore =  dbUpgrade.createObjectStore('rates', {keyPath: 'query'});
    // rateStore.createIndex('rates', 'query');

    case 0:
    const countryStore = dbUpgrade.createObjectStore('countries', {keyPath: 'currencyName'} );

  case 1:
    const rateStore =  dbUpgrade.createObjectStore('rates', {keyPath: 'query'});
  
   
    }
  });
// let toast = document.getElementById('toast');

//Check for service worker update
const _updateReady = (worker) => {
        console.log('New Version Available')
            .then(() => {
                worker.postMessage({ action: 'skipWaiting' })
            }, () => {
             console.log('err');
            })

};

const _trackInstalling = (worker) => {
    worker.addEventListener('statechange', () => {
        if (worker.state === 'installed') {
             _updateReady(worker);
        }
    })
};


if ('serviceWorker' in navigator) {
    
    navigator.serviceWorker.register('sw.js').then(reg => {

        if (reg.waiting) {
            _updateReady(reg.waiting);
            return;
        }
        if (reg.installing) {
            _trackInstalling(reg.installing);
            return;
        }
        reg.addEventListener('updatefound', () => {
            _trackInstalling(reg.installing)
        })
    }).catch(error => {
        console.log('fail', error)
    });
    // Refresh only once
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
    })
}


// check if Service Worker support exists in browser or not
// if( 'serviceWorker' in navigator ) {
//     //Service Worker support exists
//     navigator.serviceWorker.register( '/sw.js').then( function( ) { 
//                 console.log('Service Worker Registered');
//             })
//             .catch( function( err) {
//                 console.log(`Service Worker Error :- ${err}`);
//             });
// } else {

// }






//   dbPromise.then(db=>{
//     let countries = db.transaction('countries').objectStore('countries');
//    return countries.put();
//    }).then( val => {
//        console.log('The value result is', val);
//    });

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

                 dbPromise.then(db=>{
                let rates = db.transaction('rates', 'readwrite')
               let ratesStore = rates.objectStore('rates');
               json.query = query;
               console.log(json);
                ratesStore.put(json);
               });
                // let val = json[query]['val'];
                // dbPromise.then(db=>{
                //    const rates = db.transaction('rates', 'readwrite')
                //    let rateStore = rates.objectStore('rates');
                //    json.query = query;                    
                //     // console.log(json);
                //     rateStore.put(json);
                //    }).then(val =>{
                //        console.log('The value result is', val);
                //    });
                
                    // let val = json[query]['val'];
                // dbPromise.then(db => {
                //     const rates = db.transaction('rates', 'readwrite')
                //    const  rateStore = rates.objectStore('rates');
                //    json.query = query;                    
                //     console.log(json);
                //     rateStore.put(json);
                //    }).then(val =>{
                //        console.log('The value result is', val);
                //    });
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
        // console.log(amount);
        // console.log(typeof amount);
    //    console.log(json);
  
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
                
            dbPromise.then(db=>{
                let countries = db.transaction('countries', 'readwrite')
               let  countriesStore = countries.objectStore('countries');
                countriesStore.put(countryAbbreviations[countryAbbreviation]);
               });
                let option = document.createElement("option");
                option.text = `${countryAbbreviations[countryAbbreviation]['name']} - ${countryAbbreviations[countryAbbreviation]['currencyId']}`;
                option.value = countryAbbreviations[countryAbbreviation]['currencyId'];
                elements[el].add(option);
            }
        }
    })
  }



window.addEventListener('DOMContentLoaded', () => {
    let conversionRate = new FreeCurrencyConverter();

    // Populate currency fields
    populateCurrencyOptions(conversionRate);

    document.getElementById('convert-amount').addEventListener('click', () => {
        convertAmount(conversionRate);
    }, true);
}, true);