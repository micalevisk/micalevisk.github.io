'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    var FUNCTIONS_ENDPOINT = 'https://wt-89c6c15cc2042eb4fe4b1fb85909cac3-0.sandbox.auth0-extend.com/fetchMicaleviskRepos';
    var RULES = {
      IGNORE: function IGNORE(_ref) {
        var description = _ref.description;
        return description.includes(':guardsman:');
      },
      SHOW_URL: function SHOW_URL(nodeRepo) {
        if (!nodeRepo.isPrivate || nodeRepo.description.includes(':unlock:')) {
          return nodeRepo.isFork ? nodeRepo.url : nodeRepo.homepageUrl || nodeRepo.url;
        }
      }
    };

    /**
     * @param {Repository} nodeRepo https://developer.github.com/v4/object/repository/#fields
     * @param {string} rule
     * @return {string|null}
     */
    var checkRule = function checkRule(nodeRepo, rule) {
      return RULES[rule](nodeRepo);
    };

    /**
     *
     * @param {(data: Object) => void} onSuccess
     * @param {(data: Object) => void} onError
     */
    function fetchDataFromRestAPI(onSuccess, onError) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', FUNCTIONS_ENDPOINT, true);
      xhr.onerror = onError;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          (xhr.status === 200 ? onSuccess : onError)(JSON.parse(xhr.response));
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
    var removeEmojis = function removeEmojis(str) {
      return str.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '');
    };

    /**
     * Remove "caracteres especiais" do texto correspondente
     * à descrição de um repositório do GitHub.
     * @param {string} str
     * @return {string}
     */
    function parserDescription(str) {
      var strParsed = str || '';
      return removeEmojis(strParsed.replace(/\B:\w+:\B/g, ''));
    }

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
        getBorderStyle: function getBorderStyle(color, idx) {
          return _defineProperty({
            'border-bottom-color': color
          }, 'border-' + (idx & 1 ? 'left' : 'right') + '-color', color);
        },
        fetchData: function fetchData() {
          var _this = this;

          var parseGraphQLData = function parseGraphQLData(repos) {
            return repos.reduce(function (parsedRepos, _ref3) {
              var node = _ref3.node;

              if (checkRule(node, 'IGNORE')) return parsedRepos;

              var languages = node.languages.edges;
              var parsedRepo = {
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
                owner: node.owner.login
              };

              if (!!languages[0]) {
                parsedRepo.languages = languages.map(function (_ref4) {
                  var _ref4$node = _ref4.node,
                      name = _ref4$node.name,
                      color = _ref4$node.color;
                  return { name: name, color: color };
                });
                parsedRepo.language_color = getDeepValue(parsedRepo, ['languages', 0, 'color']) || '';
              }

              parsedRepos.push(parsedRepo);
              return parsedRepos;
            }, []);
          };

          var errorCallback = function errorCallback(error) {
            _this.message.loading = _this.message.error;
            console.error(error);
          };

          var successCallback = function successCallback(_ref5) {
            var data = _ref5.data;

            _this.my_repos = parseGraphQLData(getDeepValue(data, ['viewer', 'repositories', 'edges']));
            _this.message.body = parserDescription(getDeepValue(data, ['viewer', 'bio'])) || _this.message.body;
          };

          fetchDataFromRestAPI(successCallback, errorCallback);
          // successCallback(REPOS)
        }
      },

      computed: {
        filteredRepos: function filteredRepos() {
          var _this2 = this;

          if (!this.search.trim()) return this.my_repos;
          return this.my_repos.filter(function (_ref6) {
            var languages = _ref6.languages;

            return languages.map(function (lang) {
              return lang.name.toLowerCase();
            }).includes(_this2.search.toLowerCase());
          });
        }
      }
    });
  }
})();
