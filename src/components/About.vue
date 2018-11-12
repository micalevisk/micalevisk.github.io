<template>
  <header>
    <p>
      <small v-once>
        {{ title }}
        <a :href="authorProfileHref" v-text="authorName"
           target="_blank" title="GitHub Profile" rel="noopener">
        </a>
        <br>
        &raquo;<a :href="githubProfileLanguagesAPI"
           target="_blank" title="pie chart with profile languages" rel="noopener">
          acessar gráfico de uso das linguagens
        </a>
        <br>
        &raquo;<a :href="gistWithTasks"
           target="_blank" title="micalevisk.gist" rel="noopener">
          what I'm learning
        </a>
        <br>
      </small>
      {{ content }}
    </p>


    <hr>
  </header>
</template>

<script>
export default {
  name: 'about',
  props: ['title', 'authorProfileHref', 'authorName', 'content', 'usernameGithub'],

  data() {
    return {
      githubProfileLanguagesAPI: `https://ionicabizau.github.io/github-profile-languages/api.html?@${this.usernameGithub}`,
      gistWithTasks: `https://gist.github.com/micalevisk/c07638d8ed2099a6bd351405915efae8`,
    }
  }
}
</script>

<style scoped>
a:hover {
  color: white !important;
  background: #004466;
}

a:hover,
a:visited,
a:active,
a:link {
  color: #004466;
  text-decoration: none;
  padding: 0 0.4%;
}
</style>
