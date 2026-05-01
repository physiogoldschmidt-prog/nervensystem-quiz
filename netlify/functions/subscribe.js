const TIPPS = {
  'Gut reguliert': [
    'Baue Achtsamkeitspraktiken in deinen Alltag ein um deine Regulationsfähigkeit zu vertiefen.',
    'Körperliche Bewegung wie Yoga oder Schwimmen stärkt den Vagusnerv weiter.',
    'Schütze bewusst deine Erholungszeiten — auch wenn alles gut läuft.',
    'Teile deine Ressourcen mit anderen — Ko-Regulation ist ein Geschenk.'
  ],
  'Mäßig reguliert': [
    'Starte morgens mit 5 Minuten langsamem, tiefem Atmen durch die Nase.',
    'Kaltes Wasser im Gesicht oder am Hals kann das Nervensystem schnell beruhigen.',
    'Reduziere bewusst Reize — weniger Bildschirm, weniger Lärm, mehr Natur.',
    'Osteopathie kann tief festgehaltene Spannungsmuster im Körper lösen.'
  ],
  'Wenig reguliert': [
    'Langsame, verlängerte Ausatmung (4 Sek. ein, 8 Sek. aus) aktiviert den Parasympathikus.',
    'Suche bewusst nach Momenten der Sicherheit — Menschen, Orte, Rituale die sich gut anfühlen.',
    'Sanfte Körperarbeit wie Osteopathie oder Craniosacral-Therapie kann das System entsichern.',
    'Kleine konsistente Schritte schlagen große sporadische Veränderungen.'
  ],
  'Stark dysreguliert': [
    'Fange klein an — ein einziger tiefer Atemzug am Tag zählt.',
    'Körperkontakt (Umarmungen, warmes Bad, Eigenberührung) sendet Sicherheitssignale ans Nervensystem.',
    'Professionelle Begleitung durch Osteopathie und Therapie ist hier besonders wertvoll.',
    'Bitte Menschen die dir guttun um Nähe — Ko-Regulation ist heilsam.'
  ]
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email, name, score, kategorie } = JSON.parse(event.body);
  const vorname = name || 'du';
  const tipps = TIPPS[kategorie] || TIPPS['Mäßig reguliert'];

  // Kontakt in Brevo speichern
  await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      email,
      attributes: { FIRSTNAME: name || '', NS_SCORE: score, NS_KATEGORIE: kategorie },
      listIds: [6],
      updateEnabled: true
    })
  });

  // Willkommens-E-Mail senden
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: 'Lisa Goldschmidt', email: 'lisa.goldschmidt@stressfrei-er-leben.de' },
      to: [{ email }],
      subject: `Dein Nervensystem-Ergebnis: ${kategorie}`,
      htmlContent: `
        <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#3a3a3a;padding:32px 24px;">
          <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#8a7e6e;margin-bottom:24px;">
            Lisa Goldschmidt · Osteopathie und Stressmanagement
          </p>

          <h1 style="font-size:24px;color:#2d4a3e;margin-bottom:12px;">
            Hallo ${vorname},
          </h1>

          <p style="font-size:16px;line-height:1.7;color:#5a5a5a;margin-bottom:24px;">
            danke dass du dir Zeit genommen hast um in dich hineinzuspüren.
            Dein Ergebnis zeigt: Dein Nervensystem ist gerade <strong>${kategorie}</strong> —
            du hast <strong>${score} von 100 Punkten</strong> erreicht.
          </p>

          <div style="background:#f0f7f3;border-radius:12px;padding:24px;margin-bottom:28px;">
            <h2 style="font-size:17px;color:#2d4a3e;margin-bottom:16px;">Deine nächsten Schritte:</h2>
            <ul style="padding-left:20px;line-height:2;color:#4a4a4a;font-size:15px;">
              ${tipps.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>

          <p style="font-size:15px;line-height:1.7;color:#5a5a5a;margin-bottom:28px;">
            Dein Nervensystem ist kein Feind — es schützt dich.
            Wenn du tiefer in die Arbeit mit deinem Nervensystem einsteigen möchtest,
            bin ich da. In meiner Praxis begleite ich dich mit Osteopathie,
            Körperarbeit und ganzheitlichem Coaching.
          </p>

          <a href="https://www.doctolib.de"
             style="display:inline-block;background:#2d4a3e;color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:15px;margin-bottom:32px;">
            Erstgespräch buchen →
          </a>

          <hr style="border:none;border-top:1px solid #e8e2d8;margin-bottom:24px;" />

          <p style="font-size:13px;color:#b0a898;line-height:1.6;">
            Lisa Goldschmidt · Stressfrei-er-leben.de · Berlin<br/>
            Du erhältst diese E-Mail weil du am Nervensystem-Quiz teilgenommen hast.<br/>
            <a href="https://super-nasturtium-992bd1.netlify.app/.netlify/functions/unsubscribe?email=${encodeURIComponent(email)}" style="color:#b0a898;">Vom E-Mail-Verteiler abmelden</a>
          </p>
        </div>
      `
    })
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true })
  };
};
