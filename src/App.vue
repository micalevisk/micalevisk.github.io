<template>
  <div id="app" class="panel">
    <vue-headful v-once
                 :title="`@${usernameGithub} ~ gh repos`" />
    <back-to-top bottom="50px" right="50px">
      <button type="button" class="btn btn-info btn-to-top"><i class="fas fa-arrow-circle-up"></i></button>
    </back-to-top>

    <fieldset>

      <label v-once>{{ title | titleCased }}</label>

      <about
        :title="header.title"
        :authorProfileHref="header.author.profile"
        :authorName="header.author.name | titleCased"
        :content="header.body"
        :usernameGithub="usernameGithub" />

      <input v-if="fetchFinish" type="text" v-model="search" placeholder="filter by language">

      <div v-if="myRepos.length" class="unselectable">
        <br>
        <repos-container :filter="search" :repos="myRepos" />
      </div>
      <span v-else>
        <p v-if="fetchFinish" v-text="errorMessage"></p>
        <p v-else class="unselectable loading-progress">loading<span>.</span><span>.</span><span>.</span></p>
      </span>

    </fieldset>
  </div>
</template>

<script>
import BackToTop from 'vue-backtotop'
import About from './components/About'
import ReposContainer from './components/ReposContainer'
import { toTitleCase, parserDescription, getDeepValue, fetchDataFromRestAPI, localStorageWithExpiration } from './utils'


const LOCALSTORAGE = {
  key: Symbol('ls2').toString(),
  duration: 1000 * 60 * 1
};

const RULES = {
  IGNORE:   ({ description }) => description && description.includes(':guardsman:'),
  SHOW_URL: ({ isPrivate, isFork, url, homepageUrl, description}) => {
    if (!isPrivate || (description && description.includes(':unlock:')))
      return isFork ? url : (homepageUrl || url);
  },
}

/**
 * Aplica a validação de uma regra que deve ser definida.
 * @param {Repository} nodeRepo https://developer.github.com/v4/object/repository/#fields
 * @param {string} rule A regra a ser verificada.
 * @returns {string|null} O retorno da validação da regra.
 */
const checkRule = (nodeRepo, rule) => RULES[rule](nodeRepo)

/**
 * Trata os nós obtidos da API GraphQL do GitHub,
 * a fim de filtrar e formatar campos de informações
 * sobre os dados recuperados.
 * @param {[object]} repos Os dados recuperados da API do GitHub.
 * @returns {[object]} Os dados filtrados e formatdos corretamente.
 * @see https://developer.github.com/v4
 */
function parseGraphQLData(repos) {
  return repos.reduce((parsedRepos, { node }) => {
    if ( checkRule(node, 'IGNORE') ) return parsedRepos
    const languages = node.languages.edges

    const parsedRepo = {
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
      owner: node.owner.login,
    }

    // eslint-disable-next-line
    if (!!languages[0]) {
      parsedRepo.languages = languages.map( ({ node: {name, color} }) => ({name, color}) )
      parsedRepo.language_color = getDeepValue(parsedRepo, ['languages', 0, 'color']) || ''
    }

    parsedRepos.push(parsedRepo)
    return parsedRepos
  }, [])
}


export default {
  name: 'app',

  components: {
    About,
    BackToTop,
    ReposContainer,
  },

  data() {
    const usernameGithub = 'micalevisk'

    return {
      title: `${usernameGithub}'s GitHub Repositories`,
      search: '',
      myRepos: [],
      usernameGithub,
      fetchFinish: false,
      loadingMessage: 'loading...',
      errorMessage: '666 ERROR',
      header: {
        title: `Copyright (c) ${(new Date()).getFullYear()}`,
        body: '',
        author: {
          name: 'micael levi l. c.',
          profile: `https://github.com/${usernameGithub}`
        }
      }
    }
  },

  created() {
    this.fetchData()
  },

  filters: {

    titleCased(value) {
      return value ? toTitleCase(value) : ''
    }

  },

  methods: {

    finalizarFetch() {
      this.fetchFinish = true
    },

    fetchData() {
      const errorCallback = error => {
        this.finalizarFetch()
        // eslint-disable-next-line
        console.error(error.message)
      }

      const successCallback = (ghData, save = true) => {
        this.myRepos     = parseGraphQLData( getDeepValue(ghData, ['data', 'viewer', 'repositories', 'edges']) )
        this.header.body = parserDescription( getDeepValue(ghData, ['data', 'viewer', 'bio']) ) || this.header.body
        this.finalizarFetch()
        if (save) localStorageWithExpiration.save(LOCALSTORAGE.key, ghData, LOCALSTORAGE.duration)
      }

      // tentar recuperar dados cached
      const savedData = localStorageWithExpiration.load(LOCALSTORAGE.key)
      if (savedData) successCallback(savedData, false)
      else fetchDataFromRestAPI(successCallback, errorCallback)
    }

  }
}
</script>

<style src="./assets/app.css"></style>

<style scoped>
.btn-to-top {
  width: 60px;
  height: 60px;
  padding: 10px 16px;
  border-radius: 50%;
  font-size: 22px;
  line-height: 22px;
  color: #004466;
  cursor: pointer;
  opacity: 0.5;
}

@keyframes blink {
  0% {
    opacity: .2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: .2;
  }
}

.loading-progress span {
  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

.loading-progress span:nth-child(2) {
  animation-delay: .2s;
}

.loading-progress span:nth-child(3) {
  animation-delay: .4s;
}
</style>
