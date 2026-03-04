mapboxgl.accessToken = 'pk.eyJ1IjoiamFuaWNlNDA0IiwiYSI6ImNtYW56cTZmZzAxcHUybXE0cmpmcng1dzEifQ.SUIs5UGxRbRMgrc9zC1PAg'; // Add default public map token from your Mapbox account

const map = new mapboxgl.Map({
    container: 'my-map', // map container ID
    style: 'mapbox://styles/janice404/cmkyibwwh00h001pa0h822d13', // style URL
    center: [-79.3897, 43.6548], // starting position [lng, lat]
    zoom: 11, // starting zoom level
});

map.on('load', () => {

    // Add data sources containing point and line data
    map.addSource('ambulance-stations', {
        type: 'geojson',
        data: 'data/ambulance_stations.geojson'
    });

    map.addSource('health-services', {
        type: 'geojson',
        data: 'data/health_services.geojson'
    });

    map.addSource('mental-health-services', {
        type: 'geojson',
        data: 'data/mental_health_services.geojson'
    });

    map.addSource('sexual-health-services', {
        type: 'geojson',
        data: 'data/sexual_health_services.geojson'
    });

    map.addSource('ward-boundaries', {
        type: 'geojson',
        data: 'data/ward_boundaries.geojson'
    });

    // Visualize data layers on map

    // Visualize ward boundaries

    map.addLayer({
        'id': 'ward-boundaries-lines',
        'type': 'line',
        'source': 'ward-boundaries',
        'paint': {
            'line-width': 1,
            'line-color': '#000000'
        }
    });

    // Visualize ambulance stations

    map.addLayer({
        'id': 'ambulance-stations-points',
        'type': 'circle',
        'source': 'ambulance-stations',
        'layout': { visibility: 'none' },
        'paint': {
            'circle-radius': 6,
            'circle-color': '#ff0000'
        }
    });

    // Toggle visibility based on checkbox selection

    document.getElementById('toggle-stations')
        .addEventListener('change', function (e) {

            if (e.target.checked) {
                map.setLayoutProperty(
                    'ambulance-stations-points',
                    'visibility',
                    'visible'
                );
            } else {
                map.setLayoutProperty(
                    'ambulance-stations-points',
                    'visibility',
                    'none'
                );
            }
        });

    // Visualize health services

    map.addLayer({
        'id': 'health-services-points',
        'type': 'circle',
        'source': 'health-services',
        'paint': {
            'circle-radius': 6,
            'circle-color': '#ff9500'
        }
    });

    // Toggle visibility based on checkbox selection

    document.getElementById('toggle-health-services')
        .addEventListener('change', function (e) {

            if (e.target.checked) {
                map.setLayoutProperty(
                    'health-services-points',
                    'visibility',
                    'visible'
                );
            } else {
                map.setLayoutProperty(
                    'health-services-points',
                    'visibility',
                    'none'
                );
            }
        });

    // Visualize mental health services

    map.addLayer({
        'id': 'mental-health-services-points',
        'type': 'circle',
        'source': 'mental-health-services',
        'layout': { visibility: 'none' },
        'paint': {
            'circle-radius': 6,
            'circle-color': '#9000ff',
        }
    });

    // Toggle visibility based on checkbox selection

    document.getElementById('toggle-mental-health')
        .addEventListener('change', function (e) {

            if (e.target.checked) {
                map.setLayoutProperty(
                    'mental-health-services-points',
                    'visibility',
                    'visible'
                );
            } else {
                map.setLayoutProperty(
                    'mental-health-services-points',
                    'visibility',
                    'none'
                );
            }
        });

    // Visualize sexual health services

    map.addLayer({
        'id': 'sexual-health-services-points',
        'type': 'circle',
        'source': 'sexual-health-services',
        'layout': { visibility: 'none' },
        'paint': {
            'circle-radius': 6,
            'circle-color': '#fb00ff'
        }
    });

    // Toggle visibility based on checkbox selection

    document.getElementById('toggle-sexual-health')
        .addEventListener('change', function (e) {

            if (e.target.checked) {
                map.setLayoutProperty(
                    'sexual-health-services-points',
                    'visibility',
                    'visible'
                );
            } else {
                map.setLayoutProperty(
                    'sexual-health-services-points',
                    'visibility',
                    'none'
                );
            }
        });

    // Filter and visualize commercial health services only

    const commercial = document.getElementById('toggle-commercial');

    commercial.addEventListener('change', function (e) {

        if (e.target.checked) {

            map.setFilter('health-services-points',
                ['==', ['get', 'LEGAL_STATUS'], '(60) Commercial']
            );

            map.setFilter('mental-health-services-points',
                ['==', ['get', 'LEGAL_STATUS'], '(60) Commercial']
            );

            map.setFilter('sexual-health-services-points',
                ['==', ['get', 'LEGAL_STATUS'], '(60) Commercial']
            );

        } else {

            map.setFilter('health-services-points', null);
            map.setFilter('mental-health-services-points', null);
            map.setFilter('sexual-health-services-points', null);
        }

    });

    // Filter and visualize non-profit or charity services

    const nonprofit = document.getElementById('toggle-nonprofit');

    nonprofit.addEventListener('change', function (e) {

        if (e.target.checked) {

            map.setFilter('health-services-points',
                ['==', ['get', 'LEGAL_STATUS'], '(50) Non Profit ; (51) Registered Charity']
            );

            map.setFilter('mental-health-services-points',
                ['==', ['get', 'LEGAL_STATUS'], '(50) Non Profit ; (51) Registered Charity']
            );

            map.setFilter('sexual-health-services-points',
                ['==', ['get', 'LEGAL_STATUS'], '(50) Non Profit']
            );

        } else {

            map.setFilter('health-services-points', null);
            map.setFilter('mental-health-services-points', null);
            map.setFilter('sexual-health-services-points', null);
        }

    });

    // Create popups for health services

    const health_popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'health-services-points', function (e) {

        map.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const hospitalName = e.features[0].properties.AGENCY_NAME;

        health_popup
            .setLngLat(coordinates)
            .setHTML(`<strong>${hospitalName}</strong>`)
            .addTo(map);
    });

    map.on('mouseleave', 'health-services-points', function () {

        map.getCanvas().style.cursor = '';
        health_popup.remove();

    });

    // Create popups for mental health services

    const mental_health_popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'mental-health-services-points', function (e) {

        map.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const hospitalName = e.features[0].properties.AGENCY_NAME;

        mental_health_popup
            .setLngLat(coordinates)
            .setHTML(`<strong>${hospitalName}</strong>`)
            .addTo(map);
    });

    map.on('mouseleave', 'mental-health-services-points', function () {

        map.getCanvas().style.cursor = '';
        mental_health_popup.remove();

    });

    // Create popups for sexual health services

    const sexual_health_popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mouseenter', 'sexual-health-services-points', function (e) {

        map.getCanvas().style.cursor = 'pointer';

        const coordinates = e.features[0].geometry.coordinates.slice();
        const hospitalName = e.features[0].properties.AGENCY_NAME;

        sexual_health_popup
            .setLngLat(coordinates)
            .setHTML(`<strong>${hospitalName}</strong>`)
            .addTo(map);
    });

    map.on('mouseleave', 'sexual-health-services-points', function () {

        map.getCanvas().style.cursor = '';
        sexual_health_popup.remove();

    });

});