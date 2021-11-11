// const campground = require("../../models/campground");

mapboxgl.accessToken = mapToken; //variable mapToken is defined in show.ejs file inside <script>

const camp = JSON.parse(campground)
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/examples/cjgiiz9ck002j2ss5zur1vjji',
    center: camp.geometry.coordinates,
    zoom: 10
});

new mapboxgl.Marker()
    .setLngLat(camp.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${camp.title}</h3><p>${camp.location}</p>`
            )
    )
    .addTo(map)