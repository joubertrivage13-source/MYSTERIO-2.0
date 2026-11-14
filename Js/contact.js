const { createClient } = supabase;
const SUPABASE_URL = 'https://qsugdsafjgjnrcwbljda.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Q_3wDcjRgP2dku9PZs7HvQ_YUw-O3ko';
const supabaseUrl = SUPABASE_URL.trim();
const supabaseAnonKey = SUPABASE_ANON_KEY.trim();
const isSupabaseConfigured = Boolean(
    supabaseUrl
    && supabaseAnonKey
    && supabaseUrl !== 'https://votre-projet.supabase.co'
    && supabaseAnonKey !== 'votre-cle-publique'
);
const sb = isSupabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    const statusElement = document.getElementById('formStatus');
    const submitButton = contactForm.querySelector('[type="submit"]');

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Les robots qui remplissent ce champ reçoivent un succès simulé, sans requête réseau.
        if (contactForm.elements.namedItem('website').value.trim()) {
            contactForm.reset();
            statusElement.dataset.state = 'success';
            statusElement.textContent = 'Votre message a bien été envoyé.';
            return;
        }

        if (!isSupabaseConfigured) {
            const error = 'Supabase n’est pas configuré : renseignez l’URL du projet et la clé publique anon dans Js/contact.js.';
            console.error(error);
            statusElement.dataset.state = 'error';
            statusElement.textContent = 'Formulaire non configuré';
            return;
        }

        submitButton.disabled = true;
        statusElement.dataset.state = 'pending';
        statusElement.textContent = 'Envoi de votre message en cours...';

        try {
            const payload = {
                full_name: contactForm.elements.namedItem('full_name').value.trim(),
                email: contactForm.elements.namedItem('email').value.trim(),
                phone: contactForm.elements.namedItem('phone').value.trim() || null,
                subject: contactForm.elements.namedItem('subject').value.trim() || null,
                message: contactForm.elements.namedItem('message').value.trim(),
            };

            const { error } = await sb.from('contacts').insert([payload]);
            if (error) {
                throw error;
            }

            contactForm.reset();
            statusElement.dataset.state = 'success';
            statusElement.textContent = 'Votre message a bien été envoyé.';
        } catch (error) {
            console.error('Erreur lors de l’envoi du formulaire de contact :', error);
            statusElement.dataset.state = 'error';
            const errorCode = error && error.code ? ` (${error.code})` : '';
            const errorMessage = error && error.message
                ? error.message
                : 'Vérifiez votre connexion Internet et réessayez.';
            statusElement.textContent = `Échec de l’envoi${errorCode} : ${errorMessage}`;
        } finally {
            submitButton.disabled = false;
        }
    });
}
