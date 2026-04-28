exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, name, score, kategorie } = JSON.parse(event.body);

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      email,
      attributes: {
        FIRSTNAME: name || '',
        NS_SCORE: score,
        NS_KATEGORIE: kategorie
      },
      listIds: [6],
      updateEnabled: true
    })
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};
