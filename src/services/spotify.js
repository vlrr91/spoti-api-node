// Read .env file
require('dotenv').config();

const fetch = require('node-fetch');

let tokenAPI;

async function generateToken() {
  console.log('token generado')
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const headerAuthorization = `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`;

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');

  const url = 'https://accounts.spotify.com/api/token';
  const headers = { 'Authorization': headerAuthorization };
  const body = params;
  const method = 'post';

  try {
    const response = await fetch(url, { method, headers, body });
    const { access_token: token } = await response.json();
    return token;
  } catch (error) {
    console.log(`Error generateToken ${error}`);
  }
}

function validateToken(response) {
  if (response.error && response.error.status === 401) {
    return false;
  }
  return true;
}

async function fetchData(url) {
  let token;

  if (tokenAPI) {
    token = tokenAPI;
  } else {
    tokenAPI = await generateToken();
    token = tokenAPI;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  try {
    const response = await fetch(url, { headers });
    return await response.json();
  } catch (error) {
    console.log(`Error fetchData: ${error}`);
  }
}

async function getDataSpotify(url) {
  try {
    const data = await fetchData(url);

    const isTokenActive = validateToken(data);

    if (isTokenActive) {
      return data;
    }

    tokenAPI = await generateToken();
    return await fetchData(url);

  } catch (error) {
    console.log(`Error getDataSpotify ${error}`);
  }
}

module.exports = {
  getDataSpotify
}