
const apiKey = process.env.OPENCAGE_API_KEY;

async function getCoordinates(address) {
  const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`);
  const data = await response.json();

  if (data.results.length === 0) {
    throw new Error('No coordinates found for this address');
  }

  const { lat, lng } = data.results[0].geometry;
  return { lat, lng };
}

module.exports = getCoordinates;
