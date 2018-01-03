const gitHubAPI = {
  endpoints: {
    root: 'https://api.github.com',
    categories: { // endpoint categories
      emojis: '/emojis',
      user: '/users/:user/repos',
    }
  },

  HTTP_options() {
    return {
      baseURL: this.endpoints.root,
    }
  },

  emojis_path() {
    return this.endpoints.categories.emojis;
  },

  user_path(user) {
    return replacer(this.endpoints.categories.user, {user});
  }
};


const app = new Vue({
  el: '#app',

  data: {
    title: "Micalevisk's Public Repositories",
    message: {
      title: 'Copyright (c) 2017',
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

      axios.create( gitHubAPI.HTTP_options() ).get( gitHubAPI.user_path(this.username) )
        .then(response => this.my_repos = response.data.map(onlyUsefulData))
        .catch(errorCallback)
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
