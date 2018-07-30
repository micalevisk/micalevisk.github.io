const FUNCTIONS_ENDPOINT = 'https://wt-89c6c15cc2042eb4fe4b1fb85909cac3-0.sandbox.auth0-extend.com/fetch-micalevisk-repos';


/**
 * Torna maiúsculas todas as iniciais da string.
 * @param {string} str
 * @returns {string}
 */
export function toTitleCase(str) {
  return str.replace(/\w\S*/g,
                    txt => txt.charAt(0).toUpperCase() + txt.substr(1));
}


/**
 *
 * @param {(data: Object) => void} onSuccess
 * @param {(data: Object) => void} onError
 */
export function fetchDataFromRestAPI(onSuccess, onError) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', FUNCTIONS_ENDPOINT, true);
  xhr.onerror = onError;
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      (   xhr.status === 200
        ? onSuccess
        : onError
      )( JSON.parse(xhr.response) );
    }
  };
  xhr.send();
}


/**
 * Acesso seguro a valores profundamentes aninhados em um objeto.
 * Adaptado de (c) 'sharifsbeat' at https://medium.com/javascript-inside/99bf72a0855a
 * @param {object} obj - Objeto alvo do acesso das propriedades listadas
 * @param {[string]} path - O "caminho" para o valor de `obj` a ser acessado
 * @returns {*} O valor da propriedade acessada ou `undefined` caso não exista
 */
export const getDeepValue = (obj, path) =>
  path.reduce((xs, x) => ((xs instanceof Object) && (x in xs)) ? xs[x] : undefined, obj);


/**
 * Remove (quase) todos os emojis de uma string.
 * (c) 'jony89' at https://stackoverflow.com/questions/10992921
 * @param {string} str
 * @returns {string} A string sem a maioria dos emojis
 */
const removeEmojis = str =>
  str.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '');

/**
 * Remove "caracteres especiais" do texto correspondente
 * à descrição de um repositório do GitHub.
 * @param {string} str
 * @returns {string}
 */
export function parserDescription(str) {
  const strParsed = str || '';
  return removeEmojis( strParsed.replace(/\B:\w+:\B/g, '') );
}
