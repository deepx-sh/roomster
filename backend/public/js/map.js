const [lng, lat] = coordinates;
  // Step 1: Initialize the map
  const map = L.map('map').setView([lat,lng], 8); // Set to India by default

  // Step 2: Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

const marker = L.marker([lat, lng]).addTo(map).bindPopup(`<b>${listing.title}</b><br>${listing.location}<br>₹${listing.price}`);;