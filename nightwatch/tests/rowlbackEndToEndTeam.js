// Test navigation entre la page d'accueil et la page de l'équipe
// Vérifier que tout les éléments soient présents sur la page principale + navbar
// Vérification URL
// Navigation vers la page équipe
// Vérification de la redirection vers la pageDetails depuis la page équipe

const url = 'https://staging.rowlback.com/'

const teamPanelSelector = '#home > main > div > div:nth-child(2) > div > div';
const teamLinkSelector = '#home > main > div > div:nth-child(2) > div > div > a.customer.pa';

describe('rowlbackTeam', function () {
  it('Navigate from HomeView to TeamView/TeamDetails', function (browser) {

    browser

      .navigateTo(url)
      .assert.urlContains(url)

      //éléments de la homepage
      .waitForElementVisible('body', 1000)
      .assert.visible('body')
      .window.maximize()
      .assert.visible('.footer-component')
      .assert.textContains('h1', 'Bonjour !')
      .assert.elementsCount('p', 5)
      .assert.visible('a[href="/about-us"]')
      .expect.element('p').text.to.not.equal('')

    browser

      .execute(function () {
        const images = document.getElementsByTagName('img');
        return Array.from(images).every(img => img.naturalWidth > 0);
      }, [], function (result) {
        browser.assert.ok(result.value, 'Toutes les images devraient être chargées correctement');
      })

    browser

      .assert.visible('nav')
      .assert.elementsCount('nav a', 5)
      .assert.visible('a[href="/team"]')
      .pause(500)
      .click('a[href="/team"]')

      //page team
      .waitForElementVisible('body', 500)
      .assert.urlContains(url + 'team')
      .assert.visible('h1', 'Rowlbackers')

      //verification de l'appararition du panel
      .assert.visible(teamPanelSelector)
      .assert.visible(teamLinkSelector)

      // Test hover
      .waitForElementVisible('.pa', 500)
      .moveToElement('.pa', 10, 10)
      .pause(500)

      .execute(function () {

        const element = document.querySelector('.pa');
        const computedStyle = window.getComputedStyle(element, '::after');
        const afterOpacity = computedStyle.opacity; 
        const afterContent = computedStyle.content; 

        return { afterOpacity, afterContent };
      }, [], function (result) {
        browser.assert.notEqual(result.value.afterOpacity, '0', '::after doit être visible après hover');
        browser.assert.notEqual(result.value.afterContent, 'none', '::after doit contenir du le nom après hover');
      })

      .click(teamLinkSelector)
      .waitForElementVisible('body')
      .assert.urlContains(url + 'team/pierre-antoine')
      .pause(500)

    const elements = ['h1', 'h2', 'h3', 'p']
    elements.forEach(function (txt) {
      browser.assert.visible(txt)
    })

    browser

      .execute(function () {
        const images = document.getElementsByTagName('img');
        return Array.from(images).every(img => img.naturalWidth > 0);
      }, [], function (result) {
        browser.assert.ok(result.value, 'Toutes les images devraient être chargées correctement');
      })

  });
});