(function () {

    var current = {
        lat: 37.790347,
        lng: -122.392343
    };

    var items = {
        name: 'Haight Ashbury Free Medical Clinic',
        availabletime: 'Sunday, July 9, 2017<br>8:00am - 5:00pm',
        call: '(408)281-2838',
        service: 'Free Clinic | Free General Health',
        lat: 37.770000,
        lng: -122.448637,
        address: '558 Clayton St San Francisco, CA 94117'
    };

    // template for jsrender
    var template = '<div class="row"><div class="col-xs-6"><div id="summary-container"></div></div><div class="col-xs-6"><div id="map-container"></div></div></div>';
    // summary-side template
    var summaryTemplate =
        '<div class="row">' +
        //'<i class="fa fa-arrow-left  fa-3x" aria-hidden="true"></i>'+
        '<div class="col-sm-12 text-center" style="height:80px;"><div class="center-block"><a href="https://hercare.herokuapp.com/"><img src="https://s3.amazonaws.com/hfh-yamashita/image/upbutton-link.png" alt=""></a></div></div>' +
        '<h2>{{:name}}</h2>' +
        '<hr style="margin: 20px 0px 20px -30px; width: 110%; color: #f0f0f0; height: 5px; background-color:#f0f0f0;" />' +
        '<div class="row">' +
        '<div class="col-sm-6" style="height:90px;">' +
        '<p class="availabletime">{{:availabletime}}</p>' +
        '</div>' +
        '<div class="col-sm-6" style="height:90px;">' +
        '<div class="pull-left"><p class="call text-center" style="width:150px;">CALL {{:call}}</p></div>' +
        '</div>' +
        '</div>' +
        '<p>{{:service}}</p>' +
        '<hr style="margin: 20px 0px; width: 100%; color: black; height: 1px; background-color:black;" />' +
        '<div class="row">' +
        '<div class="col-sm-6" style="height:80px;">' +
        '<span class="label-span">PREFERRED DAY(S)</span>' +
        '<div class="form-group">' +
        '<div class="input-group date" id="preferred-day-input">' +
        '<input type="text" class="form-control" />' +
        '<span class="input-group-addon">' +
        '<span class="glyphicon glyphicon-calendar"></span>' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-sm-6" style="height:80px;">' +
        '<span class="label-span">PREFERRED TIMES</span>' +
        '<div class="form-group">' +
        '<div class="input-group date" id="preferred-time-input">' +
        '<input type="text" class="form-control" />' +
        '<span class="input-group-addon">' +
        '<span class="glyphicon glyphicon-calendar"></span>' +
        '</span>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="col-sm-12" style="height:60px;">' +
        '<div class="col-10">' +
        '<input class="form-control" type="text" placeholder="Name" id="name-input">' +
        '</div>' +
        '</div>' +
        '<div class="col-sm-12" style="height:60px;">' +
        '<div class="col-10">' +
        '<input class="form-control" type="text" placeholder="Phone Number" id="phone-input">' +
        '</div>' +
        '</div>' +
        '<div class="col-sm-12" style="height:60px;">' +
        '<div class="col-10">' +
        '<input class="form-control" type="text" placeholder="Email Address" id="email-input">' +
        '</div>' +
        '</div>' +
        '<div class="col-sm-12" style="height:80px;">' +
        '<button type="button" class="btn btn-secondary btn-lg btn-block" id="submit-button">Request Appointment</button>' +
        '</div>' +
        '</div>' +
        '</div>';

    // render left-side
    var renderSummary = function (items) {
        var template = $.templates(summaryTemplate);
        //$('#summary-container').append(summaryTemplate)
        $('#summary-container').html(template(items));
    };

    // retrieve input date
    var retrieveInputData = function () {
        return {
            date: $('#preferred-day-input').find('input').val(),
            time: $('#preferred-time-input').find('input').val(),
            name: $('#name-input').val(),
            phone: $('#phone-input').val(),
            email: $('#email-input').val()
        };
    };

    // regist preferred book
    var registPreferredBook = function (data) {
        var url = 'https://kuz5qgd9nc.execute-api.us-east-1.amazonaws.com/prod/record';
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: url,
                data: JSON.stringify(data),
                dataType: 'json'
            }).done(function (r) {
                console.log(r);
                return resolve(r);
            }).fail(function (e) {
                console.log(e);
                return reject(e);
            });
        });
    };

    // attach event to summary-side
    var attachEventsSummary = function () {
        $('#preferred-day-input').datetimepicker({
            format: 'MM/DD/YYYY'
        });
        $('#preferred-time-input').datetimepicker({
            format: 'LT'
        });
        $('#submit-button').click(function () {
            var submitItems = retrieveInputData();
            console.log(submitItems);
            registPreferredBook(submitItems).then(function (r) {
                swal({
                    title: 'Appointment is requested.',
                    text: '',
                    type: 'success'
                }, function () {
                    return;
                });
            }).catch(function (e) {
                swal({
                    title: 'Failed to request appointment.',
                    text: '',
                    type: 'error'
                }, function () {
                    return;
                });
            });
        });
        $('#summary-container').click(function () {
            history.back();
        });
    };

    var LeftControl = function (controlDiv, map) {

        var html = '<div style="margin: 20px;">' +
            '<div class="row" style="border-bottom: 2px solid #f0f0f0;">' +
            '<div class="col-sm-3"><div class="direction bus"></div></div>' +
            '<div class="col-sm-3"><div class="direction car"></div></div>' +
            '<div class="col-sm-3"><div class="direction walking"></div></div>' +
            '<div class="col-sm-3"></div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-sm-12" style="font-family:Lato; font-size:12pt; font-weight:bold; height: 30px;">' + items.address + '</div>' +
            '</div>' +
            '<div class="row">' +
            '<div class="col-sm-12"><div class="pull-right"><button type="button" class="btn btn-secondary btn-lg btn-block" id="direction-button">Get directions</button></div></div>' +
            '</div>' +
            '<div>';

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.id = 'custom-control-div';
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.innerHTML = html;
        controlUI.title = '';
        controlDiv.appendChild(controlUI);

        /*
        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Arvo';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        //controlText.innerHTML = 'Center Map';
        controlUI.appendChild(controlText);
        */

    };

    var catchElement = function (selector, callback, errback) {
        var iterate = function (selector, callback, errback, timeout, interval) {
            setTimeout(function () {
                timeout -= interval;
                if ($(selector)[0]) {
                    callback($(selector));
                } else if (timeout > 0) {
                    iterate(selector, callback, errback, timeout, interval);
                } else {
                    if (errback) {
                        errback;
                    } else {
                        callback;
                    }
                }
            }, interval);
        };
        var timeout = 10000;
        var interval = 100;
        iterate(selector, callback, errback, timeout, interval);
    };

    // render rigth-side
    var renderMap = function (lat, lng) {
        $('#map-container').css({
            height: $(window).height() * 1.2
        });
        var point = new google.maps.LatLng(lat, lng);
        // map settings
        var opts = {
            zoom: 15,
            center: point,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scaleControl: true,
            mapTypeControl: false,
            draggable: true
        };

        // call map
        var map = new google.maps.Map(document.getElementById('map-container'), opts);
        // other options
        var DS = new google.maps.DirectionsService();
        var DR = new google.maps.DirectionsRenderer();
        DR.setMap(map);
        DR.setOptions( { suppressMarkers: true } );

        // set marker
        //var icon = 'https://s3.amazonaws.com/hfh-yamashita/image/location-marker2.png';
        var ratio = 95 / 66.;
        var width = 30;
        var height = width * ratio;
        var icon = {
            url: "https://s3.amazonaws.com/hfh-yamashita/image/location-marker2.png", // url
            scaledSize: new google.maps.Size(width, height), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(width/2, height) // anchor
        };
        var marker = new google.maps.Marker({
            position: point,
            map: map,
            title: '',
            icon: icon
        });

        // set custom control
        var leftControlDiv = document.createElement('div');
        //leftControlDiv.id = 'custom-control-div';
        var leftControl = new LeftControl(leftControlDiv, map);

        leftControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(leftControlDiv);

        // map event
        catchElement('#direction-button', function () {
            $('#custom-control').parent().css({ 'left': '10px' }); // not working
            $('#direction-button').click(function () {
                console.log($(this).attr('class'));
                var from = new google.maps.LatLng(current.lat, current.lng);
                var to = new google.maps.LatLng(items.lat, items.lng);
                var request = {
                    origin: from,
                    destination: to,
                    travelMode: google.maps.TravelMode.TRANSIT
                };

                DS.route(request, function (result, status) {
                    DR.setDirections(result);
                });
            });
        });
    };

    // wait for loading google
    var waitLoaded = function (callback, timeout, interval) {
        setTimeout(function () {
            timeout -= interval;
            if ((typeof google !== 'undefined') &&
                (typeof google.maps !== 'undefined') &&
                (typeof google.maps.version !== 'undefined')) {
                callback({});
            } else if (timeout > 0) {
                waitLoaded(callback, timeout, interval);
            }
        }, interval);
    }

    // initialization
    $(document).ready(function () {
        $('#container').append(template);
        waitLoaded(function () {
            renderMap(items.lat, items.lng);
        });
        renderSummary(items);
        attachEventsSummary();
    });
})();