'use strict';

window.getRottenData = async (movieData) => {
  const response = await window.fetchRottenResponse(movieData);
  const rottenPage = await window.getRottenPage(response);

  const rottenScores =
    rottenPage.body.querySelectorAll('span.mop-ratings-wrap__percentage');

  const tomatoMeter = rottenScores[0].innerHTML.replace(/[^0-9]/g, '');
  const audienceScore = rottenScores[1].innerHTML.replace(/[^0-9]/g, '');

  return {tomatoMeter: tomatoMeter,
    audienceScore: audienceScore,
    url: response.url};
};

window.fetchRottenResponse = async (movieData) => {
  const searchURL = window.constructSearchUrlForRotten(movieData);
  return fetch(searchURL);
};

window.constructSearchUrlForRotten = (movieData) => {
  const {title, year} = movieData;

  const titleWithoutSpecialCharacters = title.replace(/&/g, '');
  return `https://www.google.com/search?btnI=true&` +
         `q=${titleWithoutSpecialCharacters}+${year}+movie+Rotten+Tomatoes`
             .replace(/ /g, '+');
};

window.getRottenPage = async (response) => {
  const rottenPage = await response.text();

  const parser = new DOMParser();
  return parser.parseFromString(rottenPage, 'text/html');
};

browser.runtime.onMessage.addListener(window.getRottenData);
