// Airtable proxy — keeps the API token server-side and out of the browser
exports.handler = async (event) => {
  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE  = process.env.AIRTABLE_BASE;
  const TABLE = process.env.AIRTABLE_TABLE;

  if (!TOKEN || !BASE || !TABLE) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing environment variables' }) };
  }

  const { method = 'GET', query, body } = JSON.parse(event.body || '{}');

  let url = `https://api.airtable.com/v0/${BASE}/${TABLE}`;
  if (query) url += '?' + query;

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: method === 'POST' ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  return {
    statusCode: response.status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  };
};
