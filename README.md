# Asynchrolicious
Tiny JavaScript module to send asynchronous requests.

## Usage

Add to your node_modules via `package.json` or use your package manager:

```bash
yarn install asynchrolicious
```

```bash
npm i asynchrolicious
```

Import into your code:

```js
import myLessSillyAlias from 'asynchrolicious';
```

## Method outline

```js 
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
  const request = (url, data, method) => {/*...*/}

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
  const parseParameters = data => {/*...*/}

  /**
   * takes the optional getString or the current location.href and turns it into a Map understood by parseParameters
   *
   * @param {String} [getString] optional
   * @return {Map}
   */
  const parseHref = getString => {/*...*/}
```
  

## Missing (and maybe upcoming) features

- Arbitrary depth of Array-type parameters for `parseParameters` and `parseHref`, e.g.  
`?parameter[tier1][tier2][tier3]=argument`