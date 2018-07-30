<template>
  <div class="repos-container">

    <template v-if="filteredRepos.length">
      <li v-for="(my_repo, idx_repo) in filteredRepos" :id="idx_repo"
          :style="getBorderStyle(my_repo.language_color, idx_repo)" :key="idx_repo" class="trigger-wrapper">
        <a :href="`#${idx_repo}`" class="item-counter">{{ idx_repo + 1 }}</a>

        <div :id="`repo_${my_repo.name.toLowerCase()}`" :data-createdAt="my_repo.created_at">

          <a v-if="my_repo.isPrivate"
            :href="my_repo.href"
            :title="`updated at ${new Date(my_repo.updated_at).toLocaleString()} - owner: ${my_repo.owner}`"
            class="octicon octicon-lock repo-icon"
            target="_blank" rel="noopener">
            <svg viewBox="0 0 12 16" version="1.1" width="12" height="16">
              <path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"></path>
            </svg>
            {{ my_repo.name }}
          </a>

          <a v-else
            :href="my_repo.href"
            :title="`updated at ${new Date(my_repo.updated_at).toLocaleString()} - owner: ${my_repo.owner}`"
            target="_blank" rel="noopener">
            <svg v-if="my_repo.isFork"
                class="octicon octicon-repo-forked" version="1.1" width="10" viewBox="0 0 10 16" height="15">
              <path fill-rule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path>
            </svg>
            <svg v-else
                class="octicon octicon-repo repo-icon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true">
              <path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path>
            </svg>
            {{ my_repo.name }}
          </a>

        </div>
        <div>
          <span v-for="({name}, idx_lang) in my_repo.languages" :key="idx_lang" v-text="name" class="tag-color"></span>
          <span v-if="my_repo.description.length" class="repo-description">{{ my_repo.description }}</span>
        </div>
      </li>
    </template>
    <p v-else>No matches found</p>

  </div>
</template>

<script>
export default {
  name: 'repos-container',
  props: {
    filter: {
      type: String,
      required: true
    },
    repos: {
      type: Array,
      required: true
    }
  },

  methods: {

    getBorderStyle(color, idx) {
      return {
        'border-bottom-color': color,
        [`border-${idx & 1 ? 'left': 'right'}-color`]: color
      }
    }

  },

  computed: {

    filteredRepos() {
      return ( !this.filter.trim() )
            ? this.repos
            : this.repos.filter(({ languages }) =>
                languages.map(lang => lang.name.toLowerCase())
                         .includes(this.filter.toLowerCase()))
    }

  }
}
</script>

<style scoped>
li {
  list-style-type: none;
}

.repos-container {
  text-align: left;
}

.item-counter {
  position: absolute;
  top: 0;
  right: 0;
  margin: 2%;
  opacity: 1;
}

.item-counter,
.item-counter:hover,
.item-counter:visited,
.item-counter:active,
.item-counter:link {
  color: #e3e3e3;
  font-weight: bold;
  text-decoration: none;
  cursor:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>👆</text></svg>") 16 0,auto;
}

.tag-color {
  display: inline-block;
  background: transparent;
  border-radius: 0px;
  white-space: nowrap;
  color: #032f62;
  opacity: 0.8;
  background: #eeeeee;
  padding: 0px 0.4em;
  border-radius: 3px;
  font-size: x-small;
  line-height: 1.3;
  margin-top: 8px;
  margin-right: 5px;
}

.trigger-wrapper {
  position: relative;
  margin-bottom: 5%;
  background: white;
  margin-bottom: 20px;
  padding: 10px;
  border: 2px solid #e3e3e3;
  border-radius: 4px;
  border-bottom-color: #e3e3e3;
}

.trigger-wrapper:nth-child(even) {
  border-left-color: #e3e3e3;
  border-bottom-left-radius: 29px;
}

.trigger-wrapper:nth-child(odd) {
  border-right-color: #e3e3e3;
  border-bottom-right-radius: 29px;
}

.repo-description {
  color: #8E8E93;
  font-size: .875em;
  display: none;
  text-align: center;
  padding-top: 0.7%;
}

.trigger-wrapper:hover .repo-description {
  display: block;
}

a {
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
}

a.octicon-lock {
  /* https://www.emojicursor.app */
  cursor:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🙈</text></svg>") 16 0,auto;
}

/*!
 * GitHub Light v0.4.1
 * Copyright (c) 2012 - 2017 GitHub, Inc.
 * Licensed under MIT (https://github.com/primer/github-syntax-theme-generator/blob/master/LICENSE)
 */

/*!
 * Primer-product
 * http://primer.github.io
 *
 * Released under MIT license. Copyright (c) 2018 GitHub Inc.
 */

.octicon {
  display:inline-block;
  vertical-align:text-top;
  fill:currentColor
}

.private .mini-repo-list-item .repo-icon {
  color:rgba(27,31,35,0.7)
}

.mini-repo-list-item .repo-icon {
  float:left;
  margin-top:2px;
  margin-left:-20px;
  color:#666
}
</style>
