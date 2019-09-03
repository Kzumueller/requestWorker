export default (() => {

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
   * @param {Map} [data]
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
   * takes the optional getString or the current location.href and turns it into a Map understood by parseParameters
   *
   * @param {String} [getString] optional
   * @return {Map}
   */
  const parseHref = getString => {
    const params = new Map();

    // first we need only the query string which comes after the question mark
    const queryString = getString ? getString.replace(/[?#]/, '') : location.href.split('?')[1];

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
   * supported methods are GET (default) and POST
   * POST requests will be sent as content type x-www-form-urlencoded
   *
   * for status(es) other than 200, the Promise will be rejected, yielding an object (as described below) containing the returned status and the responseText
   *
   * @param {String} url
   * @param {Map} [data] optional
   * @param {String?} [method] defaults to GET
   * @returns {Promise<String|{{status: number, responseText: string}}>} response
   */
  const request = (url, data, method) => {
    if('POST' === method)
      return requestPost(url, data);
    else
      return requestGet(url, data);
  };

  /**
   * resolves or rejects a Promise by evaluating xhr's status (resolve for status 200, reject otherwise)
   *
   * @param {XMLHttpRequest} xhr
   * @param {Function} resolve
   * @param {Function} reject
   */
  const resolvePromise = (xhr, resolve, reject) => 200 === xhr.status ? resolve(xhr.responseText || '') : reject({status: xhr.status, responseText: xhr.responseText});

  /**
   * GET request
   *
   * @param {String} url
   * @param {Map} data
   * @returns {Promise<String|{{status: number, responseText: string}}>}
   */
  const requestGet = (url, data) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url + parseParameters(data));

    return (new Promise((resolve, reject) => {
      xhr.onload = resolvePromise.bind(null, xhr, resolve, reject);
      xhr.send();
    }));
  };

  /**
   * POST request
   *
   * @param {String} url
   * @param {Map} data
   * @returns {Promise<String|{{status: number, responseText: string}}>}
   */
  const requestPost = (url, data) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    return (new Promise((resolve, reject) => {
      xhr.onload = resolvePromise.bind(null, xhr, resolve, reject);
      xhr.send(parseParameters(data).replace('?', ''));
    }));
  };

  return {
    request,
    parseParameters,
    parseHref
  };

})();
