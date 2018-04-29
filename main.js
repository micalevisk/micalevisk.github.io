// https://developer.github.com/v4/explorer
const gitHubGrapQLAPI = {
  token: '9db70dc3b25b0757b6263383bb2e9496d04c29f0', //§ private(?)
  endpoint: 'https://api.github.com/graphql',
  queries: {
    getRepositories: (numberOfRepos, numberOfLangs) => `
      query {
        viewer {
          repositories(first: ${numberOfRepos}) {
            edges {
              node {
                name
                url
                description
                homepageUrl
                createdAt
                updatedAt
                isFork
                isPrivate
                languages(first: ${numberOfLangs}) {
                  edges {
                    node {
                      name
    }
      }
    }
              }
            }
          }
        }
  },
    `
  }
};


const app = new Vue({
  el: '#app',

  data: {
    title: "Micalevisk's Public Repositories",
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
      const errorCallback = (error) => {
        this.message.loading = '666 ERROR';
        console.error(error);
      }

      const onlyUsefulData = githubData => ({
        name: githubData.name,
        html_url: githubData.html_url,
        description: parserDescription(githubData.description),
        language: githubData.language,
        homepage: githubData.homepage,
        gith_url: githubData.gith_url,
        created_at: githubData.created_at,
        updated_at: githubData.updated_at
      });

      /*
      axios.create( gitHubAPI.HTTP_options() ).get( gitHubAPI.user_path(this.username) )
        .then(response => { console.log(response.data.length); return response })
        .then(response => this.my_repos = response.data.map(onlyUsefulData))
        .catch(errorCallback)
      */

      /*
      const requestInfo = {
        method: 'GET',
        credentials: 'include',
        headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${gitHubAPI.token}`,
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
          'mode': 'cors'
        })
      }

      return fetch(gitHubAPI.endpoints.root + gitHubAPI.user_path(this.username), requestInfo)
        .then(response => { console.log(response.data.length); return response })
        .catch(errorCallback)
      */

      const self = this;
      const xhr = new XMLHttpRequest();
      xhr.onerror = errorCallback;
      xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) self.my_repos = JSON.parse(this.response)
      };
      xhr.open('GET', gitHubAPI.endpoints.root + gitHubAPI.user_path(this.username), true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', 'Bearer ' + gitHubAPI.token); //§ não faz diferença FIXME
      xhr.send();
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
const removeEmojis = str => str.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '')

/**
 * Helper para substituir todas as ocorrências
 * de uma string no formato ":key" pelo valor
 * de "key" no objeto passado (parâmetro data).
 * @param {string} str
 * @param {object} data
 * @return {string}
 */
function replacer(str, data) {
  const strReplace = (str, key) => str.replace( new RegExp(`:${key}`, 'g'), data[key] );
  return Object.keys(data).reduce(strReplace , str);
};
