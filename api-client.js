/**
 * EduCraft AI — api-client.js
 * Client universel pour appeler le backend Vercel
 * Importé dans toutes les pages HTML
 */

const EduCraftAPI = {

  /**
   * Fonction principale de génération de contenu via l'IA
   * @param {string} prompt - Le prompt complet à envoyer à Claude
   * @returns {Promise<string>} - Le contenu généré
   */
  async generer(prompt) {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Erreur serveur (${response.status})`);
      }

      const data = await response.json();
      return data.content;

    } catch (err) {
      // Erreur réseau ou serveur éteint
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        throw new Error('Impossible de contacter le serveur. Vérifie que Vercel est déployé.');
      }
      throw err;
    }
  },

};

// Exposer globalement
window.EduCraftAPI = EduCraftAPI;
