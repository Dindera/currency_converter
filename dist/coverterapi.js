
// fetch('https://free.currencyconverterapi.com/api/v5/countries')
//   .then(function(response) {
//     return response.json();
//   })
//   .then(function(results) {
//     for (const result in results) {
//       for (const id in results[result]) {
          
//             console.log(results[result][id]["currencyId"]);
        
//       }
//     }
//   });
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



export { populateCurrencyOptions, convertAmount};