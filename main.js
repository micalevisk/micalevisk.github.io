const gitHubAPI = {
  url_api: 'https://api.github.com',
  token: '9db70dc3b25b0757b6263383bb2e9496d04c29f0', // §private§

  endpoints: {
    root: 'https://api.github.com',
    categories: { // endpoint categories
      emojis: '/emojis',
      user: '/users/{user}/repos',
    }
  },

  emojis_url() {
    return this.endpoints.root + this.endpoints.categories.emojis;
  },
  user_url(user) {
    return replacer(this.endpoints.root + this.endpoints.categories.user, {user});
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
      const onlyUsefulData = ((githubData) => {
        return {
          name: githubData.name,
          html_url: githubData.html_url,
          description: this.parserDescription(githubData.description),
          language: githubData.language,
          homepage: githubData.homepage,
          gith_url: githubData.gith_url,
          created_at: githubData.created_at,
          updated_at: githubData.updated_at
        };
      });

      this.$http.get(gitHubAPI.user_url(this.username))
        .then(response => this.my_repos = response.data.map(onlyUsefulData))
        .catch(errorCallback)
    },

    parserDescription(description) {
      let descriptionParsed = description || '';
      descriptionParsed = descriptionParsed.replace(/\s?:\w+:\s?/g, '');
      return descriptionParsed;
    }

  }
});


/**
 * @param {string} str
 * @param {object} data
 * @return {string}
 */
function replacer(str, data) {
  const strReplace = (str, key) => str.replace( new RegExp(`\{${key}\}`, 'i'), data[key] );
  return Object.keys(data).reduce(strReplace, str);
};