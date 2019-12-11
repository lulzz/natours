/*eslint-disable*/

export const displayMap = locations => {
   mapboxgl.accessToken =
      'pk.eyJ1IjoicGF0aWVudDAiLCJhIjoiY2szazAzMTE3MG1ydjNjb2NoNDd5emE2YiJ9.mMMV40j_fd0lqrZcV8a9Tg';
   var map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/patient0/ck3k05ixq010h1dm3vr68y722',
      scrollZoom: false
   });

   const bounds = new mapboxgl.LngLatBounds();

   locations.forEach(location => {
      // Create Marker
      const el = document.createElement('div');
      el.className = 'marker';

      // Add marker
      new mapboxgl.Marker({
         element: el,
         anchor: 'bottom'
      })
         .setLngLat(location.coordinates)
         .addTo(map);

      // Add popup
      new mapboxgl.Popup({
         offset: 30
      })
         .setLngLat(location.coordinates)
         .setHTML(`<p>Day ${location.day}: ${location.description}`)
         .addTo(map);

      // Extend map bounds to include current location
      bounds.extend(location.coordinates);
   });

   map.fitBounds(bounds, {
      padding: {
         top: 300,
         bottom: 300,
         left: 100,
         right: 100
      }
   });
};
