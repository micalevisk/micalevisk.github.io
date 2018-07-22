'use strict';

(function () {

  document.addEventListener('contextmenu', function (e) {
    return e.preventDefault();
  });

  try {
    __init__();
  } catch (e) {
    document.body.childNodes[3].innerHTML = '&nbsp;:-(<br>&nbsp;Something went wrong';
  }

  function __init__() {

    // https://developer.github.com/v4/explorer
    var gitHubGrapQLAPI = {
      token: '9db70dc3b25b0757b6263383bb2e9496d04c29f0',
      endpoint: 'https://api.github.com/graphql',
      queries: {
        getRepositories: function getRepositories(numberOfRepos, numberOfLangs) {
          return '\n        query {\n          viewer {\n            bio\n            repositories(first: ' + numberOfRepos + ', orderBy: { field: CREATED_AT,  direction: DESC }) {\n              edges {\n                node {\n                  ...repoInfo\n                  languages(first: ' + numberOfLangs + ') {\n                    edges {\n                      node {\n                        name\n                        color\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n\n        fragment repoInfo on Repository {\n          name\n          url\n          description\n          homepageUrl\n          createdAt\n          updatedAt\n          isFork\n          isPrivate\n        }\n      ';
        }
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

      created: function created() {
        this.fetchData();
      },

      methods: {
        fetchData: function fetchData() {
          var _this = this;

          var parseGraphQLData = function parseGraphQLData(repos) {
            return repos.map(function (_ref) {
              var node = _ref.node;

              var languages = node.languages.edges;
              var parsedRepos = {
                name: node.name,
                url: node.url,
                description: parserDescription(node.description),
                homepage: node.homepageUrl,
                created_at: node.createdAt,
                updated_at: node.updatedAt,
                isFork: node.isFork,
                isPrivate: node.isPrivate,
                languages: [],
                language_color: ''
              };

              if (!!languages[0]) {
                parsedRepos.languages = languages.map(function (_ref2) {
                  var _ref2$node = _ref2.node;
                  var name = _ref2$node.name;
                  var color = _ref2$node.color;
                  return { name: name, color: color };
                });
                parsedRepos.language_color = getDeepValue(parsedRepos, ['languages', 0, 'color']) || '';
              }

              return parsedRepos;
            });
          };

          var errorCallback = function errorCallback(error) {
            _this.message.loading = _this.message.error;
            console.error(error);
          };

          var successCallback = function successCallback(_ref3) {
            var data = _ref3.data;

            _this.my_repos = parseGraphQLData(getDeepValue(data, ['viewer', 'repositories', 'edges']));
            _this.message.body = parserDescription(getDeepValue(data, ['viewer', 'bio'])) || _this.message.body;
          };

          var client = GraphQL.makeClient(gitHubGrapQLAPI.endpoint);
          client.setHeader('Authorization', 'bearer ' + gitHubGrapQLAPI.token);
          client.query(gitHubGrapQLAPI.queries.getRepositories(100, 10), null, successCallback, errorCallback);
        }
      },

      computed: {
        filteredRepos: function filteredRepos() {
          var _this2 = this;

          if (!this.search.trim()) return this.my_repos;
          return this.my_repos.filter(function (_ref4) {
            var languages = _ref4.languages;

            return languages.map(function (lang) {
              return lang.name.toLowerCase();
            }).includes(_this2.search.toLowerCase());
          });
        }
      }
    });

    /**
     * @param {string} str
     * @return {string}
     */
    function parserDescription(str) {
      var strParsed = str || '';
      return removeEmojis(strParsed.replace(/\B:\w+:\B/g, ''));
    }

    /**
     * Remove (quase) todos os emojis de uma string.
     * (c) 'jony89' at https://stackoverflow.com/questions/10992921
     * @param {string} str
     * @return {string} A string sem a maioria dos emojis
     */
    var removeEmojis = function removeEmojis(str) {
      return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '');
    };

    /**
     * Acesso seguro a valores profundamentes aninhados em um objeto.
     * Adaptado de (c) 'sharifsbeat' at https://medium.com/javascript-inside/99bf72a0855a
     * @param {object} obj - Objeto alvo do acesso das propriedades listadas
     * @param {[string]} path - O "caminho" para o valor de `obj` a ser acessado
     * @return {*} O valor da propriedade acessada ou `undefined` caso não exista
     */
    var getDeepValue = function getDeepValue(obj, path) {
      return path.reduce(function (xs, x) {
        return xs && x in xs ? xs[x] : undefined;
      }, obj);
    };
  }
})();