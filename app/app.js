(function () {
    function loadCSS(href) {
        document.write('<link rel="stylesheet" type="text/css" href="' + href + '" />');
    }


    function loadCSS2(href) {
        document.write('<link rel="stylesheet" type="text/css" media="print" href="' + href + '" />');
    }

    function loadJS(src) {
        document.write('<script type="text/javascript" src="' + src + '"></script>');
    }

    loadCSS('./app_style.css');

    var placeholder = 'Enter Current Location';
    var search = '<div class="row"><div class="col-sm-6 col-sm-offset-3"><div id="imaginary_container"><div class="input-group stylish-input-group"><input type="text" class="form-control" id="submit-address-input" placeholder="' + placeholder + '" ><span class="input-group-addon"><button id="submit-address-button" type="submit"><span class="glyphicon glyphicon-search"></span></button></span></div></div></div></div>';

    // fetch distance from two points
    var getDistance = function (latitudeA, longitudeA, latitudeB, longitudeB) {
        /*
        latitudeA = Number(latitudeA);
        longitudeA = Number(longitudeA);
        latitudeB = Number(latitudeB);
        longitudeB = Number(longitudeB);
        var EARTH_RADIUS = 6378137;
        var latitudeRadian = (latitudeA - latitudeB) * (Math.PI / 180);
        var longitudeRadian = (longitudeA - longitudeB) * (Math.PI / 180);

        var latitudeDistance = EARTH_RADIUS * latitudeRadian;
        var longitudeDistance = Math.cos((latitudeA) * (Math.PI / 180)) * EARTH_RADIUS * longitudeRadian;

        var distance = Math.sqrt(Math.pow(latitudeDistance, 2) + Math.pow(longitudeDistance, 2));
        return distance;
        */
        var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitudeA, longitudeA), new google.maps.LatLng(latitudeB, longitudeB));
        return distance;
    }

    // fetch coordinate from address
    var getCoordsFromAddress = function (address) {
        var gc = new google.maps.Geocoder();
        return new Promise(function (resolve, reject) {
            if (!address) {
                return reject({
                    status: 'NG',
                    message: 'address is undefined'
                });
            }
            gc.geocode({
                address: address
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    return resolve({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng(),
                        address: address,
                        status: 'OK'
                    });
                } else {
                    return reject({
                        status: 'NG',
                        message: 'API return error'
                    });
                }
            });
        });
    };

    // fetch hospital lists
    var getHospitals = function () {
        var url = 'https://data.sfgov.org/resource/sci7-7q9i.json';
        return new Promise(function (resolve, reject) {
            $.ajax(url).done(function (r) {
                var ret = r.map(function (item) {
                    //console.log(item.facility_type);
                    return {
                        name: item.facility_name,
                        name: item.facility_type,
                        address: item.location_address + ' ' + item.location_city + ' ' + item.location_state,
                        lat: item.location.coordinates[1],
                        lng: item.location.coordinates[0]
                    };
                });
                console.log(ret);
                return resolve(ret);
            }).fail(function (e) {
                console.log(e);
                return reject(e);
            });
        });

    };

    // DocuSign
    var point1 = {
        lat: 37.790330,
        lng: -122.392386
    };

    // initialization
    $(document).ready(function () {
        console.log($);
        getHospitals();

        // append <innput>
        $('#container').append(search);

        // 
        $('#submit-address-button').click(function () {
            var value = $('#submit-address-input').val();
            getCoordsFromAddress(value).then(function (coord) {
                var dis = getDistance(point1.lat, point1.lng, coord.lat, coord.lng);
                console.log(dis);
            }).catch(function (e) {
                console.log(e);
            });
        });
    });
})();