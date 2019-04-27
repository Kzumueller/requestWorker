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
   * @param {String} url
   * @param {Map} data optional
   * @returns {Promise<String>} HTML response
   */
  const request = (url, data) => {/*...*/}

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
  const parseParameters = data => {/*...*/}

  /**
   * takes the current location.href and turns it into a Map understood by parseParameters
   *
   * @return {Map}
   */
  const parseHref = () => {/*...*/}
```
  

## Missing (and maybe upcoming) features

- Arbitrary depth of Array-type parameters for `parseParameters` and `parseHref`, e.g.  
`?parameter[tier1][tier2][tier3]=argument`

- POST requests
- Error Handling / processing HTTP status codes