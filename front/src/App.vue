<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      color="primary"
      dark
      width="280"
    >
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          color="white"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>{{ currentPageTitle }}</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const drawer = ref(true)
const route = useRoute()

const menuItems = [
  {
    title: '설정',
    icon: 'mdi-cog',
    to: '/settings'
  },
  {
    title: '리소스 관리',
    icon: 'mdi-database',
    to: '/resources'
  }
]

const currentPageTitle = computed(() => {
  const item = menuItems.find(item => item.to === route.path)
  return item ? item.title : '캐릭터 시트 미연시화 플러그인'
})
</script>
