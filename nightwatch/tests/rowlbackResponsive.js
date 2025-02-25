let burgerMenu = '#home > main > div > div.d-flex.justify-between.align-center.home-static > nav > div.mobile-menu > div'
let aboutUsButton = '#home > main > div > div:nth-child(2) > div > div > a'

describe('Test mobile simple', function () {

    it('devrait ouvrir le site Rowlback', function (browser) {
        browser
            .navigateTo('https://staging.rowlback.com/')
            .waitForElementVisible('body', 5000)
            .assert.visible('h1')
            .assert.textContains('h1', 'Bonjour !')
            .assert.visible(burgerMenu)
            .pause(2000)
            .assert.visible('.footer-component')
            .assert.elementsCount('p', 5)
            .expect.element('p').text.to.not.equal('')

        browser
            .execute('window.scrollTo({ top: 1000, behavior: "smooth" })')
            .pause(2000) 
            .waitForElementVisible(aboutUsButton)
            .assert.visible(aboutUsButton)

        browser
            .assert.elementPresent('a.button-more.link-button')
            .assert.visible('a.button-more.link-button')
            .execute('window.scrollTo({ bottom: 1000, behavior: "smooth" })')
            .pause(2000) 

        browser
            .click(burgerMenu)
            .pause(1000)
            .assert.elementsCount('.burger-menu a', 5)
            .pause(3000)


            .end();
    });
});