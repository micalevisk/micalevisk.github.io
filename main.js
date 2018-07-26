(function () {

document.addEventListener('contextmenu', e => e.preventDefault());

try {
  __init__();
} catch (e) {
  document.body.childNodes[3].innerHTML = '&nbsp;:-(<br>&nbsp;Something went wrong';
}


function __init__() {

  const FUNCTIONS_ENDPOINT = 'https://wt-89c6c15cc2042eb4fe4b1fb85909cac3-0.sandbox.auth0-extend.com/fetchMicaleviskRepos';
  const RULES = {
    IGNORE: ({ description }) => description.includes(':guardsman:'),
    SHOW_URL: (nodeRepo) => {
      if (!nodeRepo.isPrivate || nodeRepo.description.includes(':unlock:')) {
        return nodeRepo.isFork
             ? nodeRepo.url
             : (nodeRepo.homepageUrl || nodeRepo.url);
      }
    },
  };


  /**
   * @param {Repository} nodeRepo https://developer.github.com/v4/object/repository/#fields
   * @param {string} rule
   * @return {string|null}
   */
  const checkRule = (nodeRepo, rule) => RULES[rule](nodeRepo);

  /**
   *
   * @param {(data: Object) => void} onSuccess
   * @param {(data: Object) => void} onError
   */
  function fetchDataFromRestAPI(onSuccess, onError) {
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
   * Remove (quase) todos os emojis de uma string.
   * (c) 'jony89' at https://stackoverflow.com/questions/10992921
   * @param {string} str
   * @return {string} A string sem a maioria dos emojis
   */
  const removeEmojis = str =>
    str.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '');

  /**
   * Remove "caracteres especiais" do texto correspondente
   * à descrição de um repositório do GitHub.
   * @param {string} str
   * @return {string}
   */
  function parserDescription(str) {
    const strParsed = str || '';
    return removeEmojis( strParsed.replace(/\B:\w+:\B/g, '') );
  }

  /**
   * Acesso seguro a valores profundamentes aninhados em um objeto.
   * Adaptado de (c) 'sharifsbeat' at https://medium.com/javascript-inside/99bf72a0855a
   * @param {object} obj - Objeto alvo do acesso das propriedades listadas
   * @param {[string]} path - O "caminho" para o valor de `obj` a ser acessado
   * @return {*} O valor da propriedade acessada ou `undefined` caso não exista
   */
  const getDeepValue = (obj, path) =>
    path.reduce((xs, x) => (xs && x in xs) ? xs[x] : undefined, obj);


  new Vue({
    el: '#app',

    data: {
      title: "Micalevisk's GitHub Repositories",
      username: 'micalevisk',
      search: '',
      my_repos: [],
      message: {
        title: 'Copyright (c) 2018',
        body: 'Heeeeeyy, byyeeeee',
        error: '666 ERROR',
        loading: 'loading...',
        author: {
          name: 'Micael Levi L. C.',
          profile: 'https://github.com/micalevisk'
        }
      }
    },

    created() {
      this.fetchData();
    },

    methods: {

      getBorderStyle(color, idx) {
        return {
          'border-bottom-color': color,
          // fallback de `CSS variables`
          [`border-${idx & 1 ? 'left': 'right'}-color`]: color
        };
      },

      fetchData() {
        const parseGraphQLData = repos => {
          return repos.reduce((parsedRepos, { node }) => {
            if ( checkRule(node, 'IGNORE') ) return parsedRepos;

            const languages = node.languages.edges;
            const parsedRepo = {
              name: node.name,
              url: node.url,
              description: parserDescription(node.description),
              homepage: node.homepageUrl,
              created_at: node.createdAt,
              updated_at: node.updatedAt,
              isFork: node.isFork,
              isPrivate: node.isPrivate,
              languages: [],
              language_color: '',
              href: checkRule(node, 'SHOW_URL'),
              owner: node.owner.login,
            };

            if (!!languages[0]) {
              parsedRepo.languages = languages.map( ({ node: {name, color} }) => ({name, color}) );
              parsedRepo.language_color = getDeepValue(parsedRepo, ['languages', 0, 'color']) || '';
            }

            parsedRepos.push(parsedRepo);
            return parsedRepos;
          }, []);
        };

        const errorCallback = error => {
          this.message.loading = this.message.error;
          console.error(error);
        };

        const successCallback = ({ data }) => {
          this.my_repos     = parseGraphQLData( getDeepValue(data, ['viewer', 'repositories', 'edges']) );
          this.message.body = parserDescription( getDeepValue(data, ['viewer', 'bio']) ) || this.message.body;
        };

        fetchDataFromRestAPI(successCallback, errorCallback);
      },

    },

    computed: {

      filteredRepos() {
        if (!this.search.trim()) return this.my_repos;
        return this.my_repos.filter(({ languages }) => {
          return languages.map(lang => lang.name.toLowerCase())
                          .includes(this.search.toLowerCase());
        });
      }

    }
  });

}


}());
