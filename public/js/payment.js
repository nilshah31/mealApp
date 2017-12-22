$(document).ready(function() {
    var currgeocoder;
    //Set geo location lat and long
    navigator.geolocation.getCurrentPosition(function(position, html5Error) {
        geo_loc = processGeolocationResult(position);
        currLatLong = geo_loc.split(",");
        initializeCurrent(currLatLong[0], currLatLong[1]);
    });
    //Get geo location result
    function processGeolocationResult(position) {
        html5Lat = position.coords.latitude; //Get latitude
        html5Lon = position.coords.longitude; //Get longitude
        html5TimeStamp = position.timestamp; //Get timestamp
        html5Accuracy = position.coords.accuracy; //Get accuracy in meters
        return (html5Lat).toFixed(8) + ", " + (html5Lon).toFixed(8);
    }
    //Check value is present or not & call google api function
    function initializeCurrent(latcurr, longcurr) {
        currgeocoder = new google.maps.Geocoder();
        console.log(latcurr + "-- ######## --" + longcurr);
        if (latcurr != '' && longcurr != '') {
            var myLatlng = new google.maps.LatLng(latcurr, longcurr);
            return getCurrentAddress(myLatlng);
        }
    }

    //Get current address
    function getCurrentAddress(location) {
        currgeocoder.geocode({
            'location': location
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                console.log(results[0]);
                //$("#address").html(results[0].formatted_address);
                $("#user_location").val(results[0].formatted_address);
            } else {
                $("#user_location").val('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
});


function submit_form() {
    if(confirm('Please Note that we have only Cash on Deleivery Option, '+
            'Confirming this will place the order and we will deliever it to your location'))
    {
        sessionStorage.clear();
        return true;
    }
    return false;
}
