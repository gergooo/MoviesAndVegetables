/**
 * Movies and Vegetables
 *
 * @author Gergő Ábrahám (abrahamgergo@gmail.com)
 */

'use strict';

const RealHtmlFetcher = require('./RealHtmlFetcher');

describe('RealHtmlFetcher', function() {
  before(function() {
    removeCacheFolder();
  });

  after(function() {
    removeCacheFolder();
  });

  it('fetch response should give back text/html', async function() {
    const response = await RealHtmlFetcher.fetch('https://www.google.com/');
    const html = await response.text();

    html.should.contain('<!doctype html>');
  });

  context('cache', function() {
    let response;
    context('first call of fetch()', function() {
      it('don\'t store page in cache after fetch()', async function() {
        removeCacheFolder();

        response = await RealHtmlFetcher.fetch('https://www.google.com');

        fs.existsSync(RealHtmlFetcher.CachePath).should.be.false;
      });

      it('return with actual html', async function() {
        const html = await response.text();

        html.should.contain('<!doctype html>');
      });

      it('store html in cache', async function() {
        fs.existsSync(RealHtmlFetcher.CachePath).should.be.true;
        fs.existsSync(RealHtmlFetcher.CachePath + 'google.html').should.be.true;
      });

      it('second call of text() throws error', async function() {
        await response.text()
            .should.be.rejectedWith(TypeError, 'body used already');
      });
    });

    context('second call of fetch() for the same url', function() {
      it('text() returns with cached file', async function() {
        fs.writeFileSync(RealHtmlFetcher.CachePath + 'google.html',
            '>>> cached file content <<<');

        response = await RealHtmlFetcher.fetch('https://www.google.com');
        const html = await response.text();

        html.should.equal('>>> cached file content <<<');
      });
    });
  });

  // urls

  // not found
});


function removeCacheFolder() {
  if (fs.existsSync(RealHtmlFetcher.CachePath)) {
    const folderContent = fs.readdirSync(RealHtmlFetcher.CachePath);
    folderContent.forEach((x) => fs.unlinkSync(RealHtmlFetcher.CachePath + x));

    fs.rmdirSync(RealHtmlFetcher.CachePath);
  }
}

