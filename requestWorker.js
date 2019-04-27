window.requestWorker = (() => {

  "use strict";

  /**
   * iterates over a Map mapping parameters to arguments and returns a GET string
   *
   * brackets will automatically be added to parameter names of array types, so the following Map:
   *
   * new Map([
   *  ['scalarParam', 'scalarArg'],
   *  ['vectorParam', [1,2] ]
   * ]);
   *
   * will produce:
   *
   * '?scalarParam=scalarArg&vectorParam[]=1&vectorParam[]=2'
   *
   * @param {Map} data
   * @return {String}
   */
  const parseParameters = data => {
    if("object" !== typeof data || null === data) {
      return '';
    }

    let getString = '';

    for(let [parameter, argument] of data) {
      if(Array.prototype.isPrototypeOf(argument)) {
        getString += argument.reduce((acc, entry) => acc + `&${parameter}[]=${entry}`, '');
      } else {
        getString += `&${parameter}=${argument}`;
      }
    }

    return getString.replace('&', '?'); //replacing the first ampersand with a question mark
  };

  /**
   * takes the current location.href and turns it into a Map understood by parseParameters
   *
   * @return {Map}
   */
  const parseHref = () => {
    const params = new Map();

    // first we need only the query string which comes after the question mark
    const queryString = location.href.split('?')[1];

    if(!queryString) { // if that is undefined, we'll stop here
      return params;
    }

    // but if it isn't, we'll split it into param => arg pairs using the ampersands connecting them
    queryString.split('&').forEach(pair => {
      ((key, value) => {
        if(/\[]/g.test(key)) { // array-type parameter
          key = key.replace('[]', ''); // in parseParameters we've agreed that the Map's keys don't need brackets

          if(!Array.prototype.isPrototypeOf(params.get(key))) { // have we come across this key before?
            params.set(key, []); // if not, initialize it with an empty array...
          }

          params.get(key).push(value); // ... and insert the value in any case
        } else { // regular old non-array parameter
          params.set(key, value);
        }
      })(...decodeURI(pair).split('=')); // makes the param => arg pair human readable and splits it for the anonymous function we apply it to
    });

    return params;
  };

  /**
   * takes a URL and a Map (parameters => arguments), sends a request and returns a Promise resolving to the response
   *
   * @param {String} url
   * @param {Map} data optional
   * @returns {Promise<String>} HTML response
   */
  const request = (url, data) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url + parseParameters(data));

    return (new Promise(resolve => {
      xhr.onload = () => resolve(xhr.responseText || '');
      xhr.send();
    }));
  };

  return {
    request: request,
    parseParameters: parseParameters,
    parseHref: parseHref
  };

})();
