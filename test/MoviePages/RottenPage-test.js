/**
 * Movies and Vegetables
 *
 * @author Gergő Ábrahám (abrahamgergo@gmail.com)
 */

'use strict';

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const {MoviePage} = require('../../src/MoviePages/MoviePage');
global.MoviePage = MoviePage;
const {RottenPage} = require('../../src/MoviePages/RottenPage');

describe('rottenPage', function() {
  let document;

  before(async function() {
    const dom = await JSDOM.fromFile('./test/html/testRottenTomatoesPage.html');
    document = dom.window.document;
  });

  it('can be instantiated', function() {
    const rottenPage = new RottenPage('input doc');
    rottenPage.document.should.equal('input doc');
  });

  describe(`getMovieData`, function() {
    let rottenPage;
    let movieData;

    before(function() {
      rottenPage = new RottenPage(document);
      movieData = rottenPage.getMovieData();
    });

    it(`should read the title`);
    it(`should read the release year`);
    it(`should read the url of the page`);

    it('should read the user rating', function() {
      movieData.should.contain({userRating: 98});
    });

    it(`should read the number of users' votes`, function() {
      movieData.should.contain({numberOfUserVotes: 885203});
    });

    it('should read the critics rating', function() {
      movieData.should.contain({criticsRating: 91});
    });

    it(`should read the number of critics' votes`, function() {
      movieData.should.contain({numberOfCriticsVotes: 68});
    });
  });
});
