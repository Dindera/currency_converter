//var https = require('https');

//fetch('https://free.currencyconverterapi.com/api/v5/convert?q=USD_PHP,PHP_USD&compact=y').then(function(response) {
//   console.log(response);
//});

//	xmlhttp.open('GET', url , true);
//	xmlhttp.send();
//	xmlhttp.onreadystatechange = function(){
//		if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
//			
//			var result = xmlhttp.responseText;
//			alert(result);
//			var jsResult = JSON.parse(result);
//			var oneUnit = jsResult.rate[to]/jsResult.rates[from];
//			var amt = document.getElementById('fromAmount').value;
//			document.getElementById('toAmount').value = oneUnit*amt;
//			
//		}
//	

//	va xmlhttp = new XMLHttpRequest();

//function convertCurrency(e){
//	let from = document.getElementById('from').value;
//	let to =   document.getElementById('to').value;
//
//	
//	const url = "https://free.currencyconverterapi.com/api/v5/countries" + from + " , " + to;
//	
//	fetchUrl(e);
//
//	}
//	
//
//function fetchUrl(e){
//	
//	e.preventDefault();
//	
//	
//	
//		 fetch(url).then(function(result) {
//  return result.json();
//}).then(function(json) {
//  displayResults(json);
//});
//}


//	fetch(url).then(function(response) {
//		return response.json();
//  
//})
	
// };



// var https = require('https');


// var https = require('https');

// function convertCurrency(amount, fromCurrency, toCurrency, cb) {
//   var apiKey = 'your-api-key-here';

//   fromCurrency = encodeURIComponent(fromCurrency);
//   toCurrency = encodeURIComponent(toCurrency);
//   var query = fromCurrency + '_' + toCurrency;

//   var url = 'https://free.currencyconverterapi.com/api/v5/countries'
//             + query + ',' + apiKey;

//   https.get(url, function(res){
//       var body = '';

//       res.on('data', function(chunk){
//           body += chunk;
//       });

//       res.on('end', function(){
//           try {
//             var jsonObj = JSON.parse(body);

//             var val = jsonObj[query];
//             if (val) {
//               var total = val * amount;
//               cb(null, Math.round(total * 100) / 100);
//             } else {
//               var err = new Error("Value not found for " + query);
//               console.log(err);
//               cb(err);
//             }
//           } catch(e) {
//             console.log("Parse error: ", e);
//             cb(e);
//           }
//       });
//   }).on('error', function(e){
//         console.log("Got an error: ", e);
//         cb(e);
//   });
// }

// //uncomment to test

// convertCurrency(10, 'USD', 'PHP', function(err, amount) {
//   console.log(amount);
// });