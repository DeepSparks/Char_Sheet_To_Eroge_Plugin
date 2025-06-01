<template>
  <v-container fluid class="resources-container">
    <div class="resources-header">
      <h1 class="page-title">
        <v-icon class="title-icon">mdi-database</v-icon>
        리소스 관리
      </h1>
    </div>

    <!-- 리소스 선택 섹션 -->
    <div class="resource-selector-section" v-if="!selectedResourceName">
      <v-card class="selector-card" elevation="0">
        <v-card-title class="selector-title">
          <v-icon class="mr-2">mdi-folder-multiple</v-icon>
          리소스 선택
        </v-card-title>
        <v-card-text class="selector-content">
          <v-alert
            type="info"
            variant="tonal"
            class="mb-4"
          >
            관리할 리소스를 선택해주세요. 각 리소스는 독립적인 프로젝트 단위입니다.
          </v-alert>
          <div class="resource-grid">
            <v-card
              v-for="resourceName in resourceNames"
              :key="resourceName"
              class="resource-item"
              @click="selectResource(resourceName)"
              elevation="0"
            >
              <v-card-text class="resource-item-content">
                <v-icon class="resource-icon">mdi-folder</v-icon>
                <h3 class="resource-name">{{ resourceName }}</h3>
                <v-btn
                  color="primary"
                  variant="elevated"
                  size="small"
                  class="select-btn"
                >
                  선택
                </v-btn>
              </v-card-text>
            </v-card>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- 메인 리소스 관리 인터페이스 -->
    <v-row no-gutters class="resources-content" v-else>
      <!-- 좌측 메뉴 -->
      <v-col cols="3" class="menu-column">
        <v-card class="menu-card" elevation="0">
          <!-- 선택된 리소스 표시 -->
          <div class="selected-resource-header">
            <div class="selected-resource-info">
              <v-icon class="selected-resource-icon">mdi-folder-open</v-icon>
              <div>
                <h3 class="selected-resource-name">{{ selectedResourceName }}</h3>
                <p class="selected-resource-label">선택된 리소스</p>
              </div>
            </div>
            <v-btn
              @click="backToSelector"
              icon="mdi-arrow-left"
              variant="text"
              size="small"
              class="back-btn"
            />
          </div>
          
          <v-card-title class="menu-title">
            <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
            관리 메뉴
          </v-card-title>
          <v-list density="compact" class="group-list">
            <v-list-item
              v-for="menu in resourceMenus"
              :key="menu.id"
              :active="selectedMenuId === menu.id"
              @click="selectMenu(menu.id)"
              class="group-item"
            >
              <template v-slot:prepend>
                <v-icon class="group-icon">{{ menu.icon }}</v-icon>
              </template>
              <v-list-item-title class="group-title">{{ menu.title }}</v-list-item-title>
              <template v-slot:append>
                <v-badge
                  v-if="menu.count !== undefined"
                  :content="menu.count"
                  color="secondary"
                  class="count-badge"
                />
                <v-icon v-if="selectedMenuId === menu.id" class="active-indicator">
                  mdi-chevron-right
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- 우측 콘텐츠 -->
      <v-col cols="9" class="content-column">
        <div class="content-area">
          <!-- 장면 관리 -->
          <SceneManagement
            v-if="selectedMenuId === 'scenes'"
            :selectedResourceName="selectedResourceName"
            :renderedHTMLs="renderedHTMLs"
          />

          <!-- 이미지 관리 -->
          <ImageManagement
            v-else-if="selectedMenuId === 'images'"
            :selectedResourceName="selectedResourceName"
            :images="images"
          />

          <!-- 음성 관리 -->
          <VoiceManagement
            v-else-if="selectedMenuId === 'voices'"
            :selectedResourceName="selectedResourceName"
            :voices="voices"
          />

          <!-- 캐릭터 관리 -->
          <CharacterManagement
            v-else-if="selectedMenuId === 'characters'"
            :selectedResourceName="selectedResourceName"
            :characters="characters"
          />

          <!-- 스타일 관리 -->
          <StyleManagement
            v-else-if="selectedMenuId === 'styles'"
            :selectedResourceName="selectedResourceName"
            :styles="styles"
          />

          <!-- 배경 관리 -->
          <BackgroundManagement
            v-else-if="selectedMenuId === 'backgrounds'"
            :selectedResourceName="selectedResourceName"
            :backgrounds="backgrounds"
          />

          <!-- 기본 상태 -->
          <div v-else class="empty-state">
            <v-icon class="empty-icon" size="120">mdi-database-outline</v-icon>
            <h3 class="empty-title">관리 메뉴를 선택하세요</h3>
            <p class="empty-subtitle">좌측 메뉴에서 관리하고 싶은 리소스 유형을 선택해주세요</p>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ApiService } from '@/utils/api'
import SceneManagement from '@/components/resources/SceneManagement.vue'
import ImageManagement from '@/components/resources/ImageManagement.vue'
import VoiceManagement from '@/components/resources/VoiceManagement.vue'
import CharacterManagement from '@/components/resources/CharacterManagement.vue'
import StyleManagement from '@/components/resources/StyleManagement.vue'
import BackgroundManagement from '@/components/resources/BackgroundManagement.vue'

// 상태 관리
const selectedResourceName = ref(null)
const selectedMenuId = ref(null)

// 데이터
const resourceNames = ref([])
const renderedHTMLs = ref([])
const images = ref([])
const voices = ref([])
const characters = ref([])
const styles = ref([])
const backgrounds = ref([])

// 리소스 메뉴 정의
const resourceMenus = computed(() => [
  {
    id: 'scenes',
    title: '장면 관리',
    icon: 'mdi-image-multiple',
    count: renderedHTMLs.value.length
  },
  {
    id: 'images',
    title: '이미지 관리',
    icon: 'mdi-image',
    count: images.value.length
  },
  {
    id: 'voices',
    title: '음성 관리',
    icon: 'mdi-music',
    count: voices.value.length
  },
  {
    id: 'characters',
    title: '캐릭터 관리',
    icon: 'mdi-account-group',
    count: characters.value.length
  },
  {
    id: 'styles',
    title: '스타일 관리',
    icon: 'mdi-palette',
    count: styles.value.length
  },
  {
    id: 'backgrounds',
    title: '배경 관리',
    icon: 'mdi-image-frame',
    count: backgrounds.value.length
  }
])

// 메서드들
async function loadResourceNames() {
  try {
    const response = await ApiService.getResourceNames()
    resourceNames.value = response.resourceNames || []
  } catch (error) {
    console.error('리소스 이름 로딩 실패:', error)
  }
}

async function selectResource(resourceName) {
  selectedResourceName.value = resourceName
  selectedMenuId.value = 'scenes' // 기본으로 장면 관리 선택
  await loadAllResourceData()
}

function backToSelector() {
  selectedResourceName.value = null
  selectedMenuId.value = null
  // 데이터 초기화
  renderedHTMLs.value = []
  images.value = []
  voices.value = []
  characters.value = []
  styles.value = []
  backgrounds.value = []
}

async function selectMenu(menuId) {
  selectedMenuId.value = menuId
  await loadResourceData()
}

async function loadResourceData() {
  if (!selectedResourceName.value || !selectedMenuId.value) return

  try {
    switch (selectedMenuId.value) {
      case 'scenes':
        const htmlResponse = await ApiService.getAllRenderedHTMLs(selectedResourceName.value)
        renderedHTMLs.value = htmlResponse.renderedHTMLs || []
        break
        
      case 'images':
        const imageResponse = await ApiService.getAllImages(selectedResourceName.value)
        images.value = imageResponse.imageModels || []
        break
        
      case 'voices':
        const voiceResponse = await ApiService.getAllVoices(selectedResourceName.value)
        voices.value = voiceResponse.voiceModels || []
        break
        
      case 'characters':
        const characterResponse = await ApiService.getAllCharacters(selectedResourceName.value)
        characters.value = characterResponse.characters || []
        break
        
      case 'styles':
        const styleResponse = await ApiService.getAllStyles(selectedResourceName.value)
        styles.value = styleResponse.styles || []
        break
        
      case 'backgrounds':
        const backgroundResponse = await ApiService.getAllBackgrounds(selectedResourceName.value)
        backgrounds.value = backgroundResponse.backgrounds || []
        break
    }
  } catch (error) {
    console.error('리소스 데이터 로딩 실패:', error)
  }
}

async function loadAllResourceData() {
  if (!selectedResourceName.value) return

  try {
    // 모든 리소스 데이터를 병렬로 로드
    const [htmlResponse, imageResponse, voiceResponse, characterResponse, styleResponse, backgroundResponse] = await Promise.all([
      ApiService.getAllRenderedHTMLs(selectedResourceName.value),
      ApiService.getAllImages(selectedResourceName.value),
      ApiService.getAllVoices(selectedResourceName.value),
      ApiService.getAllCharacters(selectedResourceName.value),
      ApiService.getAllStyles(selectedResourceName.value),
      ApiService.getAllBackgrounds(selectedResourceName.value)
    ])

    renderedHTMLs.value = htmlResponse.renderedHTMLs || []
    images.value = imageResponse.imageModels || []
    voices.value = voiceResponse.voiceModels || []
    characters.value = characterResponse.characters || []
    styles.value = styleResponse.styles || []
    backgrounds.value = backgroundResponse.backgrounds || []
  } catch (error) {
    console.error('모든 리소스 데이터 로딩 실패:', error)
  }
}

// 컴포넌트 마운트 시 리소스 이름 로드
onMounted(() => {
  loadResourceNames()
})
</script>

<style scoped>
.resources-container {
  background: transparent;
  padding: 0;
  min-height: calc(100vh - 120px);
}

.resources-header {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  padding: 32px 40px;
  margin: 0 -12px 24px -12px;
  border-radius: 0 0 24px 24px;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 리소스 선택 섹션 */
.resource-selector-section {
  padding: 0 24px;
}

.selector-card {
  background: rgba(255,255,255,0.7) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 16px !important;
  box-shadow: var(--shadow-soft);
}

.selector-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  font-weight: 600;
  font-size: 16px;
}

.selector-content {
  padding: 24px;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.resource-item {
  background: rgba(255,255,255,0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 16px !important;
  cursor: pointer;
  transition: all 0.3s ease;
}

.resource-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.4);
}

.resource-item-content {
  padding: 24px;
  text-align: center;
}

.resource-icon {
  font-size: 48px;
  color: #667eea;
  margin-bottom: 16px;
}

.resource-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 16px 0;
}

.select-btn {
  border-radius: 12px;
  font-weight: 600;
}

/* 메인 리소스 관리 인터페이스 */
.resources-content {
  padding: 0 24px;
  gap: 24px;
  display: flex !important;
  flex-direction: row !important;
  align-items: flex-start;
}

.menu-column {
  padding-right: 12px;
  flex: 0 0 25% !important;
  max-width: 25% !important;
}

.content-column {
  padding-left: 12px;
  flex: 1 !important;
  max-width: 75% !important;
}

.menu-card {
  background: rgba(255,255,255,0.7) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 16px !important;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}

.selected-resource-header {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 16px 20px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.selected-resource-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-resource-icon {
  font-size: 24px;
}

.selected-resource-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.selected-resource-label {
  font-size: 12px;
  margin: 0;
  opacity: 0.8;
}

.back-btn {
  color: white !important;
}

.menu-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  font-weight: 600;
  font-size: 16px;
}

.group-list {
  padding: 8px;
  background: transparent !important;
}

.group-item {
  margin: 4px 0;
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent !important;
  min-height: 56px;
  color: #2c3e50 !important;
}

.group-item:hover {
  background: rgba(102, 126, 234, 0.1) !important;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.group-item.v-list-item--active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%) !important;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.group-icon {
  color: #667eea;
  transition: transform 0.3s ease;
}

.group-item:hover .group-icon {
  transform: scale(1.1);
}

.group-title {
  font-weight: 500;
  color: #2c3e50;
}

.count-badge {
  margin-right: 8px;
}

.active-indicator {
  color: #667eea;
  animation: pulse 2s infinite;
}

.content-area {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 16px;
  min-height: 600px;
  box-shadow: var(--shadow-soft);
  max-height: calc(80vh);
  overflow-y: auto;
  overflow-x: hidden;
}

.content-area::-webkit-scrollbar {
  width: 12px;
}

.content-area::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin: 8px;
}

.content-area::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%);
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.content-area::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 빈 상태 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 64px;
  text-align: center;
}

.empty-icon {
  color: #bdc3c7;
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.empty-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.5;
}

/* 애니메이션 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 반응형 디자인 */
@media (max-width: 960px) {
  .resources-content {
    flex-direction: column !important;
    gap: 16px;
  }
  
  .menu-column, .content-column {
    padding: 0;
    flex: 1 1 auto !important;
    max-width: 100% !important;
  }

  .menu-card {
    margin-bottom: 16px;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .page-title {
    font-size: 24px;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }
}
</style>
