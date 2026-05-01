exports.handler = async (event) => {
  const email = event.queryStringParameters && event.queryStringParameters.email;

  if (!email) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: '<p>Ungültige Anfrage.</p>'
    };
  }

  try {
    await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({ emailBlacklisted: true })
    });
  } catch (e) {
    // trotzdem Bestätigungsseite zeigen
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: `
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Abgemeldet | Lisa Goldschmidt</title>
        <style>
          body { font-family: Georgia, serif; background: #f7f4ef; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .box { background: #fff; border-radius: 20px; padding: 48px 40px; max-width: 480px; text-align: center; box-shadow: 0 4px 40px rgba(0,0,0,0.07); }
          h1 { color: #2d4a3e; font-size: 24px; margin-bottom: 16px; }
          p { color: #7a7060; font-size: 16px; line-height: 1.7; margin-bottom: 12px; }
          a { color: #5a8a72; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>Du wurdest abgemeldet.</h1>
          <p>Du erhältst keine weiteren E-Mails von mir.</p>
          <p>Wenn du dich umentscheidest, bist du jederzeit herzlich willkommen.</p>
          <a href="https://www.stressfrei-er-leben.de">Zurück zur Website</a>
        </div>
      </body>
      </html>
    `
  };
};
