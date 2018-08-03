<template>
  <div class="repos-container">

    <template v-if="filteredRepos.length">
      <li v-for="(my_repo, idx_repo) in filteredRepos" :id="idx_repo"
          :style="getBorderStyle(my_repo.language_color, idx_repo)" :key="idx_repo" class="trigger-wrapper">
        <a :href="`#${idx_repo}`" class="item-counter">{{ idx_repo + 1 }}</a>

        <div :data-createdAt="my_repo.created_at">
          <repository :repo="my_repo" />
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
import Repository from './Repository'

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

  components: {
    Repository,
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
      const filter = this.filter.trim()
      return (!filter)
            ? this.repos
            : this.repos.filter(({ languages }) =>
                languages.map(lang => lang.name.toLowerCase())
                         .includes(filter.toLowerCase()))
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
</style>
