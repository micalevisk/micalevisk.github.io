(function () {

const xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText);

    try {
      __init__(data);
    } catch (e) {
      document.body.childNodes[3].innerHTML = '&nbsp;:-(<br>&nbsp;Something went wrong';
    }
  }
};
  
xmlhttp.open('GET', 'personal.json', true);
xmlhttp.send();


function __init__({ token }) {

  // https://developer.github.com/v4/explorer
  const gitHubGrapQLAPI = {
    token,
    endpoint: 'https://api.github.com/graphql',
    queries: {
      getRepositories: (numberOfRepos, numberOfLangs) => `
        query {
          viewer {
            repositories(first: ${numberOfRepos}) {
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
      message: {
        title: 'Copyright (c) 2018',
        body: 'Heeeeeyy, byyeeeee',
        loading: 'loading...',
        author: {
          name: 'Micael Levi',
          repo: 'https://github.com/micalevisk'
        }
      },
      username: 'micalevisk',
      my_repos: []
    },

    created: function() {
      this.fetchData();
    },

    methods: {

      fetchData() {
        const parseGraphQLData = repos => {
          return repos.map(({ node }) => ({
            name: node.name,
            url: node.url,
            description: parserDescription(node.description),
            homepage: node.homepageUrl,
            created_at: node.createdAt,
            updated_at: node.updatedAt,
            isFork: node.isFork,
            isPrivate: node.isPrivate,
            language: node.languages.edges[0].node.name,
            language_color: node.languages.edges[0].node.color
          }));
        };

        const errorCallback = error => {
          this.message.loading = '666 ERROR';
          console.error(error);
        };

        const successCallback = ({ data }) => {
          this.my_repos = parseGraphQLData(data.viewer.repositories.edges);
        };

        const client = GraphQL.makeClient(gitHubGrapQLAPI.endpoint)
        client.setHeader('Authorization', 'bearer ' + gitHubGrapQLAPI.token);
        client.query(gitHubGrapQLAPI.queries.getRepositories(100, 1), null, successCallback, errorCallback);
      },

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


}


}());
