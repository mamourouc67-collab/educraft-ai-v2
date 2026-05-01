// Configuration pour Google Gemini (Gratuit)
async function generateContent(prompt) {
    const API_KEY = ""; // Laissez vide ici, on utilise la variable d'environnement sur Vercel
    const MODEL = "gemini-1.5-flash"; // Modèle rapide et gratuit
    
    // Note : Sur Vercel, l'appel passera par votre fonction serveur generate.js
    // Mais pour le client, voici la logique de structure :
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la génération');
        }

        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error("Erreur API:", error);
        return "Désolé, une erreur est survenue lors de la création du support.";
    }
}

export { generateContent };
