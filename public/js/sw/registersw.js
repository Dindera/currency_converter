// check if Service Worker support exists in browser or not
if( 'serviceWorker' in navigator ) {
    //Service Worker support exists
    navigator.serviceWorker.register( '/sw.js' , { scope : '' } )  
            .then( function( ) { 
                console.log('Service Worker Registered');
            })
            .catch( function( err) {
                console.log(`Service Worker Error :- ${err}`);
            });
} else {

}