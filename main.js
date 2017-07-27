/**
 * @param {string} str
 * @param {object} data
 * @return {string}
 */
function replacer(str, data) {
  const strReplace = (str, key) => str.replace( new RegExp(':'+key, 'g'), data[key] );
  return Object.keys(data).reduce(strReplace, str);
};

// const takeProps = (props) => (obj) => props.reduce((acc, prop) => Object.assign(acc, {[prop]: obj[prop]}), {});

// ---- private ---- //
const githubIssues = {
  username: 'micalevisk',

  url_api: 'https://api.github.com',
  client_id: '2bd44f7b2de63f939777',
  client_secret: '48992e1a6cc68c5dad39f4960f163d48178a048b',

  emoji_path: '/emojis',
  user_endpoint: '/users/:username',
  user_repos_path: '/repos',
  user_starred_path: '/starred',

  getOAuth(){
    return { 'client_id': this.client_id, 'client_secret': this.client_secret };
  },
  getUser(){
    return this.url_api + replacer(this.user_endpoint, { username: this.username });
  },

  getEmojis(){
    return { method: 'GET', url: this.url_api + this.emoji_path };
  },
  getUserRepos(){
    return { method: 'GET', url: this.getUser() + this.user_repos_path };
  },
  getUserStars(){
    return { method: 'GET', url: this.getUser() + this.user_starred_path };
  }
};


const app = new Vue({
  el: '#app',

  data:
  {
    title: "Micalevisk's Public Repositories",
    message: {
      title: 'Copyright (c) 2017 Micael Levi',
      body: 'Heeeeeyy, byyeeeee',
      loading: 'loading...'
    },
    my_repos: []
  },

  created: function() {
    this.fetchData();
  },

  methods:
  {

    fetchData(){
      const githubActions = {
        get_user_repos: githubIssues.getUserRepos(),
        get_user_stars: githubIssues.getUserStars(),
        get_emojis:     githubIssues.getEmojis()
      };

      const githubUserResource = (resource) => resource(githubIssues.getUser(), githubIssues.getOAuth(), githubActions);
      
      const errorCallback = (error) => console.error(error);
      const onlyUsefullInfos = ((githubData) => {
        return {
          name: githubData.name,
          html_url: githubData.html_url,
          description: githubData.description,
          language: githubData.language,
          homepage: githubData.homepage,
          gith_url: githubData.gith_url,
          created_at: githubData.created_at,
          updated_at: githubData.updated_at
        };
      });

      githubUserResource(this.$resource)
        .get_user_repos()
        .then(response => {
          this.my_repos = response.data.map(onlyUsefullInfos);
        }, errorCallback);
    },

    parserDescription(description){
      let descriptionParsed = description || '';
      descriptionParsed = descriptionParsed.replace(/\s?:\w+:\s?/g, '');
      return descriptionParsed;
    }

  }
});
