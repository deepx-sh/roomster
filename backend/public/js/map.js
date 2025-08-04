
  // Step 1: Initialize the map
  const map = L.map('map').setView([23.0225, 72.5714], 6); // Set to India by default

  // Step 2: Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

