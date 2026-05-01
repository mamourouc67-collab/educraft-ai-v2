/**
 * EduCraft AI — api/generate.js
 * Fonction serverless Vercel — appelle l'API Anthropic côté serveur
 * La clé API n'est jamais exposée au navigateur
 */

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Accepter seulement POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée. Utilise POST.' });
  }

  const { prompt } = req.body;

  // Validation
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 10) {
    return res.status(400).json({ error: 'Prompt invalide ou trop court.' });
  }

  // Vérifier que la clé API est configurée
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY manquante dans les variables d\'environnement');
    return res.status(500).json({
      error: 'Configuration serveur incomplète. Contacte l\'administrateur.'
    });
  }

  try {
    // Appel direct à l'API Anthropic (sans SDK pour réduire la taille du bundle)
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // Rapide et économique
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        system: `Tu es EduCraft AI, un assistant pédagogique expert.
Tu génères du contenu éducatif de haute qualité : quiz, cours, fiches de révision.
Tu adaptes toujours ton niveau de langage et tes explications au niveau scolaire demandé.
Tu utilises le markdown pour structurer tes réponses (##, ###, **gras**, listes).
Tu es précis, pédagogique et bienveillant.`,
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      console.error('Erreur API Anthropic:', response.status, errBody);

      if (response.status === 401) {
        return res.status(500).json({ error: 'Clé API invalide. Contacte l\'administrateur.' });
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'Trop de requêtes. Réessaie dans quelques secondes.' });
      }

      return res.status(500).json({ error: 'Erreur lors de la génération. Réessaie.' });
    }

    const data = await response.json();
    const contenu = data.content?.[0]?.text;

    if (!contenu) {
      return res.status(500).json({ error: 'Réponse vide de l\'IA. Réessaie.' });
    }

    return res.status(200).json({
      content: contenu,
      tokens: data.usage?.output_tokens || 0,
    });

  } catch (error) {
    console.error('Erreur inattendue:', error);
    return res.status(500).json({
      error: 'Erreur serveur inattendue. Réessaie dans quelques instants.',
    });
  }
}
