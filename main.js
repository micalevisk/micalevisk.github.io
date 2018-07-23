(function () {

document.addEventListener('contextmenu', e => e.preventDefault());

try {
  __init__();
} catch (e) {
  document.body.childNodes[3].innerHTML = '&nbsp;:-(<br>&nbsp;Something went wrong';
}


function __init__() {

  // https://developer.github.com/v4/explorer
  const gitHubGrapQLAPI = {
    token: '9db70dc3b25b0757b6263383bb2e9496d04c29f0',
    endpoint: 'https://api.github.com/graphql',
    queries: {
      getRepositories: (numberOfRepos, numberOfLangs) => `
        query {
          viewer {
            bio
            repositories(first: ${numberOfRepos}, orderBy: { field: CREATED_AT,  direction: DESC }) {
              edges {
                node {
                  ...repoInfo
                  languages(first: ${numberOfLangs}) {
                    edges {
                      node {
                        name
                        color
                      }
                    }
                  }
                }
              }
            }
          }
        }

        fragment repoInfo on Repository {
          name
          url
          description
          homepageUrl
          createdAt
          updatedAt
          isFork
          isPrivate
        }
      `
    }
  };


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
          return repos.map(({ node }) => {
            const languages = node.languages.edges;
            let parsedRepos = {
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
            };

            if (!!languages[0]) {
              parsedRepos.languages = languages.map( ({ node: {name, color} }) => ({name, color}) );
              parsedRepos.language_color = getDeepValue(parsedRepos, ['languages', 0, 'color']) || '';
            }

            return parsedRepos;
          });
        };

        const errorCallback = error => {
          this.message.loading = this.message.error;
          console.error(error);
        };

        const successCallback = ({ data }) => {
          this.my_repos     = parseGraphQLData( getDeepValue(data, ['viewer', 'repositories', 'edges']) );
          this.message.body = parserDescription( getDeepValue(data, ['viewer', 'bio']) ) || this.message.body;
        };

        const client = GraphQL.makeClient(gitHubGrapQLAPI.endpoint)
        client.setHeader('Authorization', 'bearer ' + gitHubGrapQLAPI.token);
        client.query(gitHubGrapQLAPI.queries.getRepositories(100, 10), null, successCallback, errorCallback);
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


  /**
   * @param {string} str
   * @return {string}
   */
  function parserDescription(str) {
    const strParsed = str || '';
    return removeEmojis( strParsed.replace(/\B:\w+:\B/g, '') );
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
   * Acesso seguro a valores profundamentes aninhados em um objeto.
   * Adaptado de (c) 'sharifsbeat' at https://medium.com/javascript-inside/99bf72a0855a
   * @param {object} obj - Objeto alvo do acesso das propriedades listadas
   * @param {[string]} path - O "caminho" para o valor de `obj` a ser acessado
   * @return {*} O valor da propriedade acessada ou `undefined` caso não exista
   */
  const getDeepValue = (obj, path) =>
    path.reduce((xs, x) => (xs && x in xs) ? xs[x] : undefined, obj);

}


}());
