// Test navigation entre la page d'accueil et la page clients
// Vérifier que tout les éléments soient présents sur la page principale + navbar
// Vérification URL
// Navigation vers la page client
// Test des elements de style7



describe('rowlbackTeam', function () {
    it('Navigate from HomeView to customers', function (browser) {
        browser
            .navigateTo('https://staging.rowlback.com/')
            .assert.urlContains('https://staging.rowlback.com/')

        // Charge la homepage et veirife la présence des elements    
            .waitForElementVisible('body', 5000)
            .assert.visible('body')

            .window.maximize()
            .assert.visible('.footer-component')
            .assert.textContains('h1', 'Bonjour !')
            .assert.elementsCount('p', 5)
            .expect.element('p').text.to.not.equal('')

        // Verifie la présence des images de la page 
        browser
            .execute(function () {
                const images = document.getElementsByTagName('img');
                return Array.from(images).every(img => img.naturalWidth > 0);
            }, [], function (result) {
                browser.assert.ok(result.value, 'Toutes les images devraient être chargées correctement');
            })

        browser
            .assert.visible('a[href="/about-us"]')
            .assert.visible('nav')
            .assert.elementsCount('nav a', 5)

            .assert.visible('a[href="/customers"]')
            .pause(500)
            .click('a[href="/customers"]')

            .assert.urlContains('https://staging.rowlback.com/customers')
            .pause(500)

        browser
            .execute(function () {
                const images = document.getElementsByTagName('img');
                return Array.from(images).every(img => img.naturalWidth > 0);
            }, [], function (result) {
                browser.assert.ok(result.value, 'Toutes les images devraient être chargées correctement');
            })

            .waitForElementPresent('.beauty-tech', 5000)

            // Capture l'image de fond avant hover
            .execute(function () {
                const element = document.querySelector('.beauty-tech');
                return window.getComputedStyle(element).backgroundImage;
            }, [], function (result) {
                const imageInitiale = result.value;

                // Simule le hover
                browser
                    .moveToElement('.beauty-tech', 10, 10)  // Déplace la souris sur l'élément
                    .pause(500)  // Attend que l'effet hover s'applique

                    // Vérifie que l'image a changé
                    .execute(function () {
                        const element = document.querySelector('.beauty-tech');
                        return window.getComputedStyle(element).backgroundImage;
                    }, [], function (result) {
                        browser.assert.notEqual(
                            result.value,
                            imageInitiale,
                            'L\'image devrait changer au hover'
                        );
                    });
            })

            // Déplace la souris ailleurs pour enlever le hover
            .moveToElement('body', 0, 0)
            .pause(500)

            // Cibler le footer
            .waitForElementPresent('.footer-component', 5000)

            // Vérifier les éléments du footer
            .assert.elementPresent('.footer-component .footer-logo')
            .assert.attributeEquals('.footer-component .footer-logo', 'alt', 'Rowlback')

            // Vérifier le texte de l'adresse
            .assert.textContains('.footer-text.address', '11 rue Basse 59800 Lille')

            // Vérifier le texte de l'email
            .assert.textContains('.footer-text.mail', 'contact@rowlback.com')

            // Vérifier le lien LinkedIn
            .assert.elementPresent('.socials .in')
            .assert.attributeContains('.socials .in', 'href', 'linkedin.com/company/rowlback')
            .assert.attributeEquals('.socials .in', 'title', 'Join us on Linked In')

            // Vérifier l'image LinkedIn
            .assert.elementPresent('.socials .in img')

            


    });
});