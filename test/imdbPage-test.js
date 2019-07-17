'use strict';

const jsdom = require('jsdom');
const {JSDOM} = jsdom;

// Functions under test
require('../src/imdbPage');
const {readMovieDataFromImdbPage,
  injectRottenScore} = window;

describe('imdbPage', function() {
  describe('readMovieDataFromImdbPage', function() {
    before(async function() {
      const dom = await JSDOM.fromFile('./test/testImdbPage.html',
          {url: `https://www.imdb.com/title/tt0111161/`});
      document = dom.window.document;
    });

    it('should read movie title', function() {
      const movieData = readMovieDataFromImdbPage(document);
      movieData['title'].should.deep.equal('The Shawshank Redemption');
    });

    it('should read movie\'s release year', function() {
      const movieData = readMovieDataFromImdbPage(document);
      movieData['year'].should.deep.equal('1994');
    });
  });

  describe('injectRottenScore', function() {
    before(async function() {
      const dom = await JSDOM.fromFile('./test/testImdbPage.html',
          {url: `https://www.imdb.com/title/tt0111161/`});
      document = dom.window.document;

      // Function-under-test is called here, to avoid calling it multiple times,
      // which would result in reloading the html file multiple times.
      injectRottenScore(document, 93);
    });

    it('should add child with id "movies-and-vegetables-rotten-rating"',
        function() {
          const ratingsWrapper =
            document.getElementById('star-rating-widget').parentNode;
          const moviesAndVegetables =
            document.getElementById('movies-and-vegetables-rotten-rating');

          should.exist(moviesAndVegetables);
          moviesAndVegetables.parentNode.parentNode
              .should.equal(ratingsWrapper);
        });

    it('should add given percent', function() {
      document.getElementById('movies-and-vegetables-rotten-rating').
          innerHTML.should.equal('🍅93%');
    });
  });
});