(function () {

    var items = {
        name: 'Seton medical center',
        availabletime: 'Sunday, July 9, 2017<br>8:00am - 5:00pm',
        call: '(408)281-2838',
        service: 'Birth Control, Prenatal Care',
        lat: 37.679778,
        lng: -122.474415,
        address: ''
    };

    // template for jsrender
    var template = '<div class="row"><div class="col-xs-6"><div id="summary-container"></div></div><div class="col-xs-6"><div id="map-container"></div></div></div>';
    // summary-side template
    var summaryTemplate =
    '<div>'+
        '<i class="fa fa-arrow-left  fa-3x" aria-hidden="true"></i>'+
        '<h2>{{:name}}</h2>'+
        '<div class="row">'+
            '<div class="col-sm-6" style="height:80px;">'+
                '<p>{{:availabletime}}</p>'+
            '</div>'+
            '<div class="col-sm-6" style="height:80px;">'+
                '<div class="pull-right"><p class="call text-center" style="width:150px;">CALL {{:call}}</p></div>'+
            '</div>'+
        '</div>'+
        '<p>{{:service}}</p>'+
        '<hr style="margin: 20px 0px; width: 100%; color: black; height: 1px; background-color:black;" />'+
        '<div class="row">'+
            '<div class="col-sm-6" style="height:80px;">'+
                '<span>PREFERRED DAY(S)</span>'+
                '<div class="form-group">'+
                    '<div class="input-group date" id="preferred-day-input">'+
                        '<input type="text" class="form-control" />'+
                        '<span class="input-group-addon">'+
                            '<span class="glyphicon glyphicon-calendar"></span>'+
                        '</span>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '<div class="col-sm-6" style="height:80px;">'+
                '<span>PREFERRED TIMES</span>'+
                '<div class="form-group">'+
                    '<div class="input-group date" id="preferred-time-input">'+
                        '<input type="text" class="form-control" />'+
                        '<span class="input-group-addon">'+
                            '<span class="glyphicon glyphicon-calendar"></span>'+
                        '</span>'+
                    '</div>'+
                '</div>'+
            '</div>'+

            '<div class="col-sm-12" style="height:60px;">'+
                '<div class="col-10">'+
                    '<input class="form-control" type="text" placeholder="Name" id="name-input">'+
                '</div>'+
            '</div>'+
            '<div class="col-sm-12" style="height:60px;">'+
                '<div class="col-10">'+
                    '<input class="form-control" type="text" placeholder="Phone Number" id="phone-input">'+
                '</div>'+
            '</div>'+
            '<div class="col-sm-12" style="height:60px;">'+
                '<div class="col-10">'+
                    '<input class="form-control" type="text" placeholder="Email Address" id="email-input">'+
                '</div>'+
            '</div>'+
            '<div class="col-sm-12" style="height:60px;">'+
                //'<button type="button" class="btn btn-primary" style="height:60px; width:100%;">Request Appointment</button>'+ 
                '<button type="button" class="btn btn-secondary btn-lg btn-block" id="submit-button">Request Appointment</button>'+
            '</div>'+
        '</div>'+
    '</div>';

    // render left-side
    var renderSummary = function(items){
        var template = $.templates(summaryTemplate);
        //$('#summary-container').append(summaryTemplate)
        $('#summary-container').html(template(items));
    };

    // retrieve input date
    var retrieveInputData = function(){
        return {
            date: $('#preferred-day-input').find('input').val(),
            time: $('#preferred-time-input').find('input').val(),
            name: $('#name-input').val(),
            phone: $('#phone-input').val(),
            email: $('#email-input').val()
        };
    };

    // attach event to summary-side
    var attachEventsSummary = function(){
        $('#preferred-day-input').datetimepicker({
            format: 'MM/DD/YYYY'
        });
        $('#preferred-time-input').datetimepicker({
            format: 'LT'
        });
        $('#submit-button').click(function(){
            var submitItems = retrieveInputData();
            console.log(submitItems);
        });
        $('#summary-container').click(function(){
            history.back();
        });
    };

    // render rigth-side
    var renderMap = function (lat, lng) {
        $('#map-container').css({
            height: $(window).height()
        });
        var point = new google.maps.LatLng(lat, lng);
        // map settings
        var opts = {
            zoom: 15,
            center: point,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scaleControl: true,
            draggable: true
        };

        // call map
        var map = new google.maps.Map(document.getElementById('map-container'), opts);

        // set marker
        var marker = new google.maps.Marker({
            position: point,
            map: map,
            title: coords.name,
            draggable: false
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