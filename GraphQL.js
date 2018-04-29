// (c) https://github.com/nwoodthorpe/GraphQL-Vanilla-JS
const GraphQL = (function () {
  function makeClient(endpoint) {
    let requestHeaders = {};

    // Provide some sanitization for the client
    function sanitize(query_string) {
      return query_string
        .replace(/[\n\r]*/g, "") // Remove newlines
        .replace(/"/g, "\\\""); // Escape double quotes so JSON is valid
    }

    function query(query_string, variables_string = '{}', resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint, true);

      for (let header in requestHeaders) {
        if ( !requestHeaders.hasOwnProperty(header) ) continue;
        xhr.setRequestHeader(header, requestHeaders[header]);
      }

      xhr.onerror = reject;

      xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) resolve( JSON.parse(xhr.response) );
          else reject( JSON.parse(xhr.response) );
        }
      }

      xhr.send(`{ "query": "${sanitize(query_string)}", "variables": ${variables_string} }`)
    }

    function setHeader(key, value) {
      requestHeaders[key] = value;
    }

    function unsetHeader(key) {
      delete requestHeaders[key];
    }

    return { setHeader, unsetHeader, query };
  }

  return { makeClient };
}());
