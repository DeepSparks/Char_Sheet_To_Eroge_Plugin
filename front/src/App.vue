<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      width="280"
      class="custom-drawer"
    >
      <div class="drawer-header">
        <div class="header-content">
          <v-icon size="32" color="white" class="mb-2">mdi-gamepad-variant</v-icon>
          <h3 class="header-title">미연시화 플러그인</h3>
          <p class="header-subtitle">v5.0.4</p>
        </div>
      </div>
      
      <v-list density="compact" nav class="drawer-menu">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          class="menu-item"
          color="white"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app class="custom-app-bar" elevation="0">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="nav-toggle" />
      <v-toolbar-title class="app-title">{{ currentPageTitle }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon variant="text" class="header-btn" @click="openGithub">
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main class="main-content">
      <div class="content-wrapper">
        <router-view />
      </div>
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
  },
  {
    title: '글로벌 노트 생성기',
    icon: 'mdi-note-edit',
    to: '/global-note'
  },
  {
    title: "변수 저장소",
    icon: "mdi-book-open-page-variant",
    to: "/variable-storage"
  }
]

const currentPageTitle = computed(() => {
  const item = menuItems.find(item => item.to === route.path)
  return item ? item.title : '캐릭터 시트 미연시화 플러그인'
})

const openGithub = () => {
  window.open('https://github.com/DeepSparks/Char_Sheet_To_Eroge_Plugin/releases', '_blank')
}
</script>

<style>
@font-face {
  font-family: 'bmdohyeon';
  src: url('@/assets/fonts/BMDOHYEON_ttf.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
}

:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --card-gradient: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  --shadow-soft: 0 8px 32px rgba(0,0,0,0.1);
  --shadow-hover: 0 12px 48px rgba(0,0,0,0.15);
}

body {
  font-family: 'bmdohyeon', sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.custom-drawer {
  background: var(--primary-gradient) !important;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255,255,255,0.2) !important;
}

.drawer-header {
  padding: 32px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
}

.header-content {
  text-align: center;
  color: white;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.header-subtitle {
  font-size: 12px;
  opacity: 0.8;
  margin: 4px 0 0 0;
}

.drawer-menu {
  padding: 16px 0;
}

.menu-item {
  margin: 4px 16px;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  color: white !important;
}

.menu-item :deep(.v-list-item__content) {
  color: white !important;
}

.menu-item :deep(.v-list-item-title) {
  color: white !important;
  font-weight: 500;
}

.menu-item :deep(.v-icon) {
  color: white !important;
}

.menu-item:hover {
  background: rgba(255,255,255,0.15) !important;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.menu-item:hover :deep(.v-list-item__content),
.menu-item:hover :deep(.v-list-item-title),
.menu-item:hover :deep(.v-icon) {
  color: white !important;
}

.menu-item.v-list-item--active {
  background: rgba(255,255,255,0.2) !important;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.menu-item.v-list-item--active :deep(.v-list-item__content),
.menu-item.v-list-item--active :deep(.v-list-item-title),
.menu-item.v-list-item--active :deep(.v-icon) {
  color: white !important;
  font-weight: 600;
}

.custom-app-bar {
  background: var(--primary-gradient) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.nav-toggle {
  transition: transform 0.3s ease;
}

.nav-toggle:hover {
  transform: rotate(90deg);
}

.app-title {
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  font-size: 18px;
}

.header-btn {
  transition: all 0.3s ease;
  border-radius: 50%;
}

.header-btn:hover {
  background: rgba(255,255,255,0.2);
  transform: scale(1.1);
}

.main-content {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.content-wrapper {
  padding: 0;
  background: transparent;
}

/* 전역 애니메이션 */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 스크롤바 커스터마이징 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.5);
}
</style>