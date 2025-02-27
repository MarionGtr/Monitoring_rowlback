describe('rowlbackForm', function () {
    it('Test du formulaire de contact avec captcha test', function (browser) {
        browser
            //.navigateTo('https://staging.rowlback.com/contact')
            .navigateTo('http://localhost:5173/contact')
            //.assert.urlContains('https://staging.rowlback.com/contact')
            .waitForElementVisible('body', 5000)
            .window.maximize()

            // Remplir le formulaire
            .setValue('input[name="contactName"]', 'John Wick')
            .setValue('input[name="contactEmail"]', 'test@example.com')
            .setValue('input[name="contactPhone"]','0666666666')
            .setValue('textarea[name="contactMessage"]', 'Ceci est un message de test automatisé')
            .pause(500)

            // Simuler la validation du captcha avec la clé de test officielle
            // .execute(function() {
            //     const testToken = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
            //     const recaptchaContainer = document.getElementById('recaptcha-container');
            //     if (recaptchaContainer && recaptchaContainer.__vueParentComponent) {
            //         const component = recaptchaContainer.__vueParentComponent.ctx;
            //         component.instance_vueRecaptchaV2.recaptchaVerified(testToken);
            //         component.success.value = true;
            //     }
            //     return true;
            // })
            .pause(1000)


            .waitForElementPresent('input[type="submit"].button-more', 5000)
            .click('input[type="submit"].button-more')
            .pause(1000)

            .assert.textContains('h2', 'Message envoyé !')
            .assert.not.elementPresent('form#contactForm')

            // Vérifier la réinitialisation
            .assert.valueEquals('input[name="contactName"]', '')
            .assert.valueEquals('input[name="contactEmail"]', '')
            .assert.valueEquals('input[name="contactPhone"]','')
            .assert.valueEquals('textarea[name="contactMessage"]', '')

            .end();
    });
});