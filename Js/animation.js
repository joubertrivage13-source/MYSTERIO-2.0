window.addEventListener('load', () => {
    document.getElementById('preloader').classList.add('hide');
});



(function () {
    emailjs.init({
        publicKey: "tXiZVT4ZnZpoxSY-D",
    });
})();

const form = document.getElementById("contact-form");
const button = document.getElementById("send-btn");
const status = document.getElementById("status-message");

form.addEventListener("submit", function (event) {

    event.preventDefault();

    button.disabled = true;
    button.textContent = "Envoi en cours...";

    emailjs.sendForm(
        "service_1h2utbb",
        "template_tqbtrfl",
        this
    )

    .then(function () {

        status.textContent =
            "Votre message a été envoyé avec succès !";

        status.style.color = "green";

        form.reset();

    })

    .catch(function (error) {

        status.textContent =
            "Erreur lors de l'envoi. Veuillez réessayer.";

        status.style.color = "red";

        console.log(error);

    })

    .finally(function () {

        button.disabled = false;
        button.textContent = "Envoyer le message";

    });

});
