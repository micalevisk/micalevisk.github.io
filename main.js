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

const githubIssues = {
  username: 'micalevisk',

  url_api: 'https://api.github.com',
  client_id: '2bd44f7b2de63f939777',
  client_secret: '48992e1a6cc68c5dad39f4960f163d48178a048b',

  emoji_path: '/emojis',
  user_endpoint: '/users/:username',
  user_repos_path: '/repos',
  user_starred_path: '/starred',

  getEmojis(){
    return this.url_api + this.emoji_path;
  },
  getUser(){
    return this.url_api + replacer(this.user_endpoint, { username: this.username });
  },
  getUserRepos(){
    return this.getUser() + this.user_repos_path;
  },
  getUserStars(){
    return this.getUser() + this.user_starred_path;
  },
  getOAuth(){
    return { 'client_id': this.client_id, 'client_secret': this.client_secret };
  }
};

const app =
new Vue({
      el: '#app',

      data:
      {
        title: "Micael's Public Repository",
        message: {
          title: 'Copyright (c) 2017 Micael Levi',
          body: 'Heeeeeyy, byyeeeee'
        }
        my_repos: [],
        starred_repos: [],
        emojis: {}
      },

      created(){
        this.fetchData();
      },

      methods:
      {

        fetchData(){

          const githubActions = {
            get_user_repos: { method: 'GET', url: githubIssues.getUserRepos() },
            get_user_stars: { method: 'GET', url: githubIssues.getUserStars() },
            get_emojis:     { method: 'GET', url: githubIssues.getEmojis()    }
          };

          const githubUserResource = (resource) => resource(githubIssues.getUser(), githubIssues.getOAuth(), githubActions);
          const errorCallback = (error) => console.error(error);
          const onlyUsefullInfos = ({ name, html_url, description, language }) => ({ name, html_url, description, language });

          githubUserResource(this.$resource)
            .get_user_repos()
            .then(response => {
              this.my_repos = response.data.map(onlyUsefullInfos);
            }, errorCallback);

          /*
          githubUserResource(this.$resource)
            .get_user_stars()
            .then(response => {
              this.starred_repos = response.data.map(onlyUsefullInfos);
            }, errorCallback);

          githubUserResource(this.$resource)
            .get_emojis()
            .then(response => {
              this.emojis = response.data;
            }, errorCallback);
          */
        },

        parserDescription(description){
          // const htmlTemplate = '<img src=":link" alt=":emoji" style="height: 10px; width: 10px">';
          let descriptionParsed = description || '';
          descriptionParsed = descriptionParsed.replace(/\s?:\w+:\s?/g, '');
          return descriptionParsed;
        }

      }
});
