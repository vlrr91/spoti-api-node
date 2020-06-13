// Read .env file
require('dotenv').config();

const fetch = require('node-fetch');

const UsefulError = require('../utils/useful-error');

let tokenAPI;

async function generateToken() {
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
    throw new UsefulError(error);
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

  const response = await fetch(url, { headers });
  const data = await response.json();

  if (data.error && data.error.message === 'invalid id') {
    throw new UsefulError('invalid id', 400);
  }

  if (data.error && data.error.message !==  'The access token expired') {
    throw new UsefulError(data.error.message);
  }
  
  return data;
}

async function getDataSpotify(url) {
  const data = await fetchData(url);
  const isTokenActive = validateToken(data);
 
  if (isTokenActive) {
    return data;
  }

  tokenAPI = await generateToken();
  return await fetchData(url);
}

module.exports = {
  getDataSpotify
}