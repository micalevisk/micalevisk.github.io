<template>
  <a
    :href="repo.href"
    :title="`updated at ${new Date(repo.updated_at).toLocaleString()} - owner: ${repo.owner}`"
    :class="[repo.isPrivate ? 'octicon octicon-lock repo-icon' : '']"
    target="_blank" rel="noopener">

    <svg  v-if="repo.isPrivate"
          viewBox="0 0 12 16" version="1.1" width="12" height="16">
      <path fill-rule="evenodd" d="M4 13H3v-1h1v1zm8-6v7c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1h1V4c0-2.2 1.8-4 4-4s4 1.8 4 4v2h1c.55 0 1 .45 1 1zM3.8 6h4.41V4c0-1.22-.98-2.2-2.2-2.2-1.22 0-2.2.98-2.2 2.2v2H3.8zM11 7H2v7h9V7zM4 8H3v1h1V8zm0 2H3v1h1v-1z"></path>
    </svg>

    <svg  v-else-if="repo.isFork"
          class="octicon octicon-repo-forked" version="1.1" width="10" viewBox="0 0 10 16" height="15">
      <path fill-rule="evenodd" d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"></path>
    </svg>

    <svg  v-else
          class="octicon octicon-repo repo-icon" viewBox="0 0 12 16" version="1.1" width="12" height="16" aria-hidden="true">
      <path fill-rule="evenodd" d="M4 9H3V8h1v1zm0-3H3v1h1V6zm0-2H3v1h1V4zm0-2H3v1h1V2zm8-1v12c0 .55-.45 1-1 1H6v2l-1.5-1.5L3 16v-2H1c-.55 0-1-.45-1-1V1c0-.55.45-1 1-1h10c.55 0 1 .45 1 1zm-1 10H1v2h2v-1h3v1h5v-2zm0-10H2v9h9V1z"></path>
    </svg>

    {{ repo.name }}

  </a>
</template>

<script>
export default {
  name: 'repository',
  props: {
    repo: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
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
