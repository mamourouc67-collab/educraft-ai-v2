/**
 * EduCraft AI — ui.js
 * Fonctions utilitaires d'interface partagées entre toutes les pages
 */

// ── Markdown simple → HTML ───────────────────────────────────────────────────
function markdownToHtml(text) {
  return text
    // Titres
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Gras et italique
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Ligne horizontale
    .replace(/^---$/gm, '<hr />')
    // Listes non ordonnées
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    // Listes ordonnées
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Wrapping des listes
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`)
    // Sauts de ligne → paragraphes
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul]|<p|<hr)(.+)$/gm, '$1')
    // Nettoyage
    .replace(/<p><\/p>/g, '')
    .replace(/<ul><\/ul>/g, '');
}

// ── Afficher / masquer loading ───────────────────────────────────────────────
function afficherLoading(actif) {
  const loading   = document.getElementById('loading');
  const btnGen    = document.getElementById('btn-generate');
  const btnText   = document.getElementById('btn-text');
  const resultArea = document.getElementById('result-area');

  if (actif) {
    loading?.classList.add('visible');
    resultArea?.classList.remove('visible');
    if (btnGen) btnGen.disabled = true;
    if (btnText) btnText.textContent = 'Génération en cours…';
  } else {
    loading?.classList.remove('visible');
    if (btnGen) btnGen.disabled = false;
    if (btnText) btnText.textContent = btnText.dataset.original || '⚡ Générer';
  }
}

// ── Afficher le résultat ─────────────────────────────────────────────────────
function afficherResultat(contenu) {
  const resultArea = document.getElementById('result-area');
  const resultBody = document.getElementById('result-body');

  if (!resultArea || !resultBody) return;

  // Convertir markdown → HTML
  const html = markdownToHtml(contenu);
  resultBody.innerHTML = `<p>${html}</p>`;

  resultArea.classList.add('visible');

  // Scroll doux vers le résultat
  setTimeout(() => {
    resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

// ── Afficher une erreur ──────────────────────────────────────────────────────
function afficherErreur(message) {
  const box = document.getElementById('error-box');
  const msg = document.getElementById('error-msg');
  if (box && msg) {
    msg.textContent = message;
    box.classList.add('visible');
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function masquerErreur() {
  document.getElementById('error-box')?.classList.remove('visible');
}

// ── Copier le contenu ────────────────────────────────────────────────────────
function copierContenu() {
  const body = document.getElementById('result-body');
  const btn  = document.getElementById('btn-copy');
  if (!body) return;

  const texte = body.innerText;
  navigator.clipboard.writeText(texte).then(() => {
    if (btn) {
      btn.textContent = '✓ Copié !';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copier';
        btn.classList.remove('copied');
      }, 2000);
    }
  });
}

// ── Sauvegarder le label original du bouton ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const btnText = document.getElementById('btn-text');
  if (btnText) btnText.dataset.original = btnText.textContent;

  // Animation d'apparition des éléments
  document.querySelectorAll('.feature-card, .step').forEach((el, i) => {
    el.style.animationDelay = `${i * 0.1}s`;
    el.style.animation = 'fadeUp .5s ease both';
  });
});

