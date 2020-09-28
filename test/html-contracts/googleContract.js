/**
 * Movies and Vegetables
 *
 * @author Gergő Ábrahám (abrahamgergo@gmail.com)
 */

'use strict';

const contract = require('../tools/ContractTestDescription');

contract('GoogleContract', function (fetchDOM) {
  let document;

  context('when feeling unlucky', function () {
    before(async function () {
      document = await fetchDOM(
        "https://www.google.com/search?btnI=true&q=Amblin'+1968+movie+RottenTomatoes"
      );
    });

    it('search result contains lots of hyperlinks', function () {
      document.getElementsByTagName('A').length.should.be.above(3);
    });

    it('the movie url is amongst the hrefs', function () {
      const hrefs = [...document.getElementsByTagName('A')].map((a) =>
        a.getAttribute('href')
      );

      hrefs
        .filter(
          (href) =>
            href && href.match(/https:\/\/www\.rottentomatoes\.com\/m\/amblin/)
        )
        .length.should.be.least(1);
    });
  });
});
