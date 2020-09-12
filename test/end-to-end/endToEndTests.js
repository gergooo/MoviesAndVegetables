/**
 * Movies and Vegetables
 *
 * @author Gergő Ábrahám (abrahamgergo@gmail.com)
 */

'use strict';

const {Builder, By, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const fs = require('fs');
const cmd = require('node-cmd');

describe('End-to-end tests', async function() {
  const addonFolder = 'web-ext-artifacts';
  let driver;

  before(async function() {
    const isAddonBuilt = rebuildAddon();
    const isBrowserReady = startBrowserDriver();

    await Promise.all([isAddonBuilt, isBrowserReady]);
    await installAddon();
  });

  function rebuildAddon() {
    cleanupArtifacts();
    return new Promise((resolve) => cmd.get('npm run build', resolve));
  }

  function cleanupArtifacts() {
    if (fs.existsSync(addonFolder)) {
      const folderContent = fs.readdirSync(addonFolder);
      folderContent.forEach((x) => fs.unlinkSync(`${addonFolder}/${x}`));
    }
  }

  function startBrowserDriver() {
    process.env.path = process.env.path + ';node_modules/geckodriver/';

    const options = new firefox.Options();
    options.addArguments('-headless');

    driver = new Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(options)
        .build();

    return driver.manage().setTimeouts({pageLoad: 5000});
  }

  function installAddon() {
    const artifacts = fs.readdirSync(addonFolder);
    const addonFileName = artifacts[artifacts.length - 1];

    return driver.installAddon(`${addonFolder}/${addonFileName}`, true);
  }

  context('on IMDb', function() {
    before(async function() {
      await driver.get('https://www.imdb.com/title/tt6751668/');
    });

    it('should inject audience score', async function() {
      await driver.wait(until.elementLocated(By.id('audience-score')), 10000);
      const audienceScore = (await driver).findElement(By.id('audience-score'));

      audienceScore.should.exist;
    });

    it('should inject Tomatometer', async function() {
      await driver.wait(
          until.elementLocated(By.className('titleReviewBarItem TomatoMeter')),
          1000);

      const tomatoMeter = await driver
          .findElement(By.className('titleReviewBarItem TomatoMeter'));

      tomatoMeter.should.exist;
    });
  });

  context('on RottenTomatoes', function() {
    before(async function() {
      driver.get('https://www.rottentomatoes.com/m/the_dark_knight')
          .catch((err) => {}); // it is loaded more than the 5 seconds timeout
    });

    it('should inject IMDb scores', async function() {
      await driver.wait(until.elementLocated(By.id('IMDb scores')), 10000);
      const imdbScores = await driver.findElement(By.id('IMDb scores'));

      imdbScores.should.exist;
    });
  });

  after(async function() {
    driver.quit();
  });
});
