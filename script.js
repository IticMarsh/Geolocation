let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  fetch('mapstyle.json') 
    .then(response => response.json()) 
    .then(styles => {
      map = new Map(document.getElementById("map"), {
        center: { lat: 41.390205, lng: 2.154007 },
        zoom: 12,
        styles: styles 
      });
    })
    .catch(error => {
      console.error('Error al cargar los estilos:', error);
    });

  document.getElementById("findLoc").addEventListener("click", geocodeAddress);
  document.getElementById("address").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      geocodeAddress();
    }
  });
}

function geocodeAddress() {
    let geocoder = new google.maps.Geocoder();
    let address = document.getElementById("address").value;
    geocoder.geocode({ 'address': address }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
        let latitude = results[0].geometry.location.lat();
        let longitude = results[0].geometry.location.lng();
        
        // Mostrar marcador en el mapa
        let center = new google.maps.LatLng(latitude, longitude);
        map.setCenter(center);
        map.setZoom(16);
        
        let icon = {
          url: "flag.png", 
          scaledSize: new google.maps.Size(32, 32) // Tamaño deseado
        };
        
        let marker = new google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map,
          title: "Ubicación encontrada",
          icon: icon
        });
  
        let infowindow = new google.maps.InfoWindow({
          content: "<strong>Ubicación encontrada:</strong> " + address 
        });
  
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      } else {
        alert("La dirección no se ha encontrado.");
      }
    });
  }
  