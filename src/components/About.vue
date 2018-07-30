<template>
  <header>
    <p>
      <small v-once>
        {{ title }}
        <a :href="authorProfileHref" v-text="authorName"
           target="_blank" title="GitHub Profile" rel="noopener">
        </a>
        <br>
        <a :href="githubProfileLanguagesAPI"
           id="pie-chart" target="_blank" rel="noopener">
          acessar gráfico de uso das linguagens
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
}
</style>
