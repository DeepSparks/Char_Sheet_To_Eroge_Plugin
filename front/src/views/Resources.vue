<template>
  <v-container fluid class="resources-container">
    <div class="resources-header">
      <h1 class="page-title">
        <v-icon class="title-icon">mdi-database</v-icon>
        리소스 관리
      </h1>
      <p class="page-subtitle">생성된 리소스들을 효율적으로 관리하고 다운로드하세요</p>
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
          <div v-if="selectedMenuId === 'scenes'" class="management-section">
            <div class="section-header">
              <h2 class="section-title">장면 관리</h2>
              <v-btn
                v-if="renderedHTMLs.length > 0"
                @click="downloadAllScenes"
                color="primary"
                variant="elevated"
                :loading="downloadingAll"
              >
                <v-icon start>mdi-download</v-icon>
                모든 장면 다운로드
              </v-btn>
            </div>
            
            <div v-if="renderedHTMLs.length === 0" class="empty-state">
              <v-icon class="empty-icon" size="120">mdi-image-multiple</v-icon>
              <h3 class="empty-title">생성된 장면이 없습니다</h3>
              <p class="empty-subtitle">이 리소스에는 아직 렌더링된 장면이 없습니다</p>
            </div>

            <div v-else class="scenes-grid">
              <v-card
                v-for="(scene, index) in renderedHTMLs"
                :key="scene.sequence_id"
                class="scene-card"
                elevation="0"
              >
                <div class="scene-header">
                  <h4 class="scene-title">장면 {{ scene.sequence_id }}</h4>
                  <v-btn
                    @click="downloadScene(scene, index)"
                    icon="mdi-download"
                    variant="text"
                    size="small"
                    :loading="downloadingScenes[index]"
                  />
                </div>
                <div 
                  :ref="el => sceneRefs[index] = el"
                  class="scene-content"
                  v-html="scene.renderedHTML"
                />
              </v-card>
            </div>
          </div>

          <!-- 이미지 관리 -->
          <div v-else-if="selectedMenuId === 'images'" class="management-section">
            <div class="section-header">
              <h2 class="section-title">이미지 관리</h2>
              <v-btn
                v-if="images.length > 0"
                @click="downloadAllImages"
                color="primary"
                variant="elevated"
                :loading="downloadingAll"
              >
                <v-icon start>mdi-download</v-icon>
                모든 이미지 다운로드
              </v-btn>
            </div>

            <div v-if="images.length === 0" class="empty-state">
              <v-icon class="empty-icon" size="120">mdi-image</v-icon>
              <h3 class="empty-title">생성된 이미지가 없습니다</h3>
              <p class="empty-subtitle">이 리소스에는 아직 생성된 이미지가 없습니다</p>
            </div>

            <div v-else class="images-grid">
              <v-card
                v-for="(image, index) in images"
                :key="index"
                class="image-card"
                elevation="0"
              >
                <div class="image-container">
                  <img 
                    :src="`http://127.0.0.1:3000/${image.saved_file_path}`"
                    :alt="image.name"
                    class="image-preview"
                    @error="handleImageError"
                  />
                  <v-btn
                    @click="downloadImage(image)"
                    icon="mdi-download"
                    class="download-overlay-btn"
                    variant="elevated"
                    size="small"
                  />
                </div>
                <v-card-text class="image-info">
                  <h4 class="image-title">{{ image.name }}</h4>
                  <p class="image-detail">스타일: {{ image.style_id }}</p>
                  <p class="image-detail">배경: {{ image.background_id }}</p>
                  <div class="image-actions">
                    <v-btn
                      @click="showImageDetails(image)"
                      variant="text"
                      size="small"
                      color="primary"
                    >
                      상세 정보
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </div>

          <!-- 음성 관리 -->
          <div v-else-if="selectedMenuId === 'voices'" class="management-section">
            <div class="section-header">
              <h2 class="section-title">음성 관리</h2>
              <v-btn
                v-if="voices.length > 0"
                @click="downloadAllVoices"
                color="primary"
                variant="elevated"
                :loading="downloadingAll"
              >
                <v-icon start>mdi-download</v-icon>
                모든 음성 다운로드
              </v-btn>
            </div>

            <div v-if="voices.length === 0" class="empty-state">
              <v-icon class="empty-icon" size="120">mdi-music</v-icon>
              <h3 class="empty-title">생성된 음성이 없습니다</h3>
              <p class="empty-subtitle">이 리소스에는 아직 생성된 음성이 없습니다</p>
            </div>

            <div v-else class="voices-list">
              <v-card
                v-for="(voice, index) in voices"
                :key="index"
                class="voice-card"
                elevation="0"
              >
                <v-card-text class="voice-content">
                  <div class="voice-info">
                    <h4 class="voice-title">{{ voice.name }}</h4>
                    <p class="voice-text">"{{ voice.text }}"</p>
                    <div class="voice-emotions">
                      <v-chip
                        v-for="(value, emotion) in voice.emotions"
                        :key="emotion"
                        v-if="value > 0"
                        size="small"
                        color="secondary"
                        variant="tonal"
                        class="emotion-chip"
                      >
                        {{ emotion }}: {{ value }}
                      </v-chip>
                    </div>
                  </div>
                  <div class="voice-controls">
                    <audio 
                      :ref="el => audioRefs[index] = el"
                      :src="`http://127.0.0.1:3000/${voice.saved_file_path}`"
                      @loadedmetadata="updateAudioDuration(index)"
                    />
                    <v-btn
                      @click="toggleAudio(index)"
                      :icon="playingAudio === index ? 'mdi-pause' : 'mdi-play'"
                      variant="elevated"
                      color="primary"
                      size="large"
                    />
                    <v-btn
                      @click="downloadVoice(voice)"
                      icon="mdi-download"
                      variant="text"
                      size="small"
                      style="color: black;"
                    />
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </div>

          <!-- 캐릭터 관리 -->
          <div v-else-if="selectedMenuId === 'characters'" class="management-section">
            <div class="section-header">
              <h2 class="section-title">캐릭터 관리</h2>
            </div>
            
            <div v-if="characters.length === 0" class="empty-state">
              <v-icon class="empty-icon" size="120">mdi-account-group</v-icon>
              <h3 class="empty-title">생성된 캐릭터가 없습니다</h3>
            </div>

            <v-data-table
              v-else
              :headers="characterHeaders"
              :items="characters"
              class="data-table"
              density="comfortable"
            />
          </div>

          <!-- 스타일 관리 -->
          <div v-else-if="selectedMenuId === 'styles'" class="management-section">
            <div class="section-header">
              <h2 class="section-title">스타일 관리</h2>
            </div>
            
            <div v-if="styles.length === 0" class="empty-state">
              <v-icon class="empty-icon" size="120">mdi-palette</v-icon>
              <h3 class="empty-title">생성된 스타일이 없습니다</h3>
            </div>

            <v-data-table
              v-else
              :headers="styleHeaders"
              :items="styles"
              class="data-table"
              density="comfortable"
            />
          </div>

          <!-- 배경 관리 -->
          <div v-else-if="selectedMenuId === 'backgrounds'" class="management-section">
            <div class="section-header">
              <h2 class="section-title">배경 관리</h2>
            </div>
            
            <div v-if="backgrounds.length === 0" class="empty-state">
              <v-icon class="empty-icon" size="120">mdi-image-frame</v-icon>
              <h3 class="empty-title">생성된 배경이 없습니다</h3>
            </div>

            <v-data-table
              v-else
              :headers="backgroundHeaders"
              :items="backgrounds"
              class="data-table"
              density="comfortable"
            />
          </div>

          <!-- 기본 상태 -->
          <div v-else class="empty-state">
            <v-icon class="empty-icon" size="120">mdi-database-outline</v-icon>
            <h3 class="empty-title">관리 메뉴를 선택하세요</h3>
            <p class="empty-subtitle">좌측 메뉴에서 관리하고 싶은 리소스 유형을 선택해주세요</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 로딩 오버레이 -->
    <v-overlay v-model="loading" class="loading-overlay">
      <div class="loading-content">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
          width="6"
        />
        <p class="loading-text">리소스를 처리 중입니다...</p>
      </div>
    </v-overlay>

    <!-- 이미지 상세 정보 다이얼로그 -->
    <v-dialog v-model="imageDetailDialog" max-width="800">
      <v-card v-if="selectedImageDetail">
        <v-card-title>이미지 상세 정보</v-card-title>
        <v-card-text>
          <div class="detail-grid">
            <div class="detail-item">
              <strong>이름:</strong> {{ selectedImageDetail.name }}
            </div>
            <div class="detail-item">
              <strong>스타일 ID:</strong> {{ selectedImageDetail.style_id }}
            </div>
            <div class="detail-item">
              <strong>배경 ID:</strong> {{ selectedImageDetail.background_id }}
            </div>
            <div class="detail-item">
              <strong>성별:</strong> {{ selectedImageDetail.gender }}
            </div>
            <div class="detail-item">
              <strong>파일 경로:</strong> {{ selectedImageDetail.saved_file_path }}
            </div>
            <div class="detail-item full-width">
              <strong>프롬프트:</strong>
              <p class="prompt-text">{{ selectedImageDetail.prompt }}</p>
            </div>
            <div class="detail-item full-width">
              <strong>네거티브 프롬프트:</strong>
              <p class="prompt-text">{{ selectedImageDetail.negative_prompt }}</p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="imageDetailDialog = false">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { ApiService } from '@/utils/api'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'

// 상태 관리
const loading = ref(false)
const downloadingAll = ref(false)
const downloadingScenes = ref([])
const selectedResourceName = ref(null)
const selectedMenuId = ref(null)
const playingAudio = ref(null)
const imageDetailDialog = ref(false)
const selectedImageDetail = ref(null)

// 데이터
const resourceNames = ref([])
const renderedHTMLs = ref([])
const images = ref([])
const voices = ref([])
const characters = ref([])
const styles = ref([])
const backgrounds = ref([])

// 참조
const sceneRefs = ref([])
const audioRefs = ref([])

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

// 테이블 헤더 정의
const characterHeaders = [
  { title: '이름', key: 'name', width: '100px' },
  { title: '성별', key: 'gender', width: '100px' },
  { title: '나이', key: 'age' },
  { title: '헤어 스타일', key: 'hair_style' },
  { title: '헤어 색상', key: 'hair_color' },
  { title: '눈 색상', key: 'eye_color' },
  { title: '가슴 크기', key: 'breast_size' },
  { title: '피부 색상', key: 'skin_color' },
  { title: '음성 타입', key: 'voice_type', width: '125px' },
  { title: '기타', key: 'etc' }
]

const styleHeaders = [
  { title: '스타일 ID', key: 'style_id' },
  { title: '의상', key: 'clothes' },
  { title: '의상 색상', key: 'clothes_color' },
  { title: '브래지어', key: 'bra' },
  { title: '브래지어 색상', key: 'bra_color' },
  { title: '팬티', key: 'panties' },
  { title: '팬티 색상', key: 'panties_color' },
  { title: '기타', key: 'etc' }
]

const backgroundHeaders = [
  { title: '배경 ID', key: 'background_id' },
  { title: '설정 타입', key: 'setting_type' },
  { title: '위치', key: 'location' },
  { title: '시간대', key: 'time_period' },
  { title: '계절', key: 'season' },
  { title: '날씨', key: 'weather' },
  { title: '특별 기능', key: 'special_features' },
  { title: '기타', key: 'etc' }
]

// 메서드들
async function loadResourceNames() {
  try {
    loading.value = true
    const response = await ApiService.getResourceNames()
    resourceNames.value = response.resourceNames || []
  } catch (error) {
    console.error('리소스 이름 로딩 실패:', error)
  } finally {
    loading.value = false
  }
}

async function selectResource(resourceName) {
  selectedResourceName.value = resourceName
  selectedMenuId.value = 'scenes' // 기본으로 장면 관리 선택
  await loadResourceData()
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
    loading.value = true
    
    switch (selectedMenuId.value) {
      case 'scenes':
        const htmlResponse = await ApiService.getAllRenderedHTMLs(selectedResourceName.value)
        renderedHTMLs.value = htmlResponse.renderedHTMLs || []
        downloadingScenes.value = new Array(renderedHTMLs.value.length).fill(false)
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
  } finally {
    loading.value = false
  }
}

// 장면 다운로드 관련
async function downloadScene(scene, index) {
  try {
    downloadingScenes.value[index] = true
    
    await nextTick() // DOM 업데이트 대기
    
    const element = sceneRefs.value[index]
    if (!element) return
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    })
    
    const link = document.createElement('a')
    link.download = `${scene.sequence_id}.png`
    link.href = canvas.toDataURL()
    link.click()
  } catch (error) {
    console.error('장면 다운로드 실패:', error)
  } finally {
    downloadingScenes.value[index] = false
  }
}

async function downloadAllScenes() {
  try {
    downloadingAll.value = true
    
    const zip = new JSZip()
    
    await nextTick() // DOM 업데이트 대기
    
    for (let i = 0; i < renderedHTMLs.value.length; i++) {
      const scene = renderedHTMLs.value[i]
      const element = sceneRefs.value[i]
      
      if (element) {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        })
        
        const dataUrl = canvas.toDataURL()
        const base64Data = dataUrl.split(',')[1]
        zip.file(`${scene.sequence_id}.png`, base64Data, { base64: true })
      }
    }
    
    const content = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.download = `${selectedResourceName.value}_scenes.zip`
    link.href = URL.createObjectURL(content)
    link.click()
  } catch (error) {
    console.error('모든 장면 다운로드 실패:', error)
  } finally {
    downloadingAll.value = false
  }
}

// 이미지 다운로드 관련
async function downloadImage(image) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/${image.saved_file_path}`)
    const blob = await response.blob()
    const link = document.createElement('a')
    
    const image_name = image.saved_file_path.split('/').pop().split('.')[0]
    link.download = `${image_name}.png`
    link.href = URL.createObjectURL(blob)
    link.click()
  } catch (error) {
    console.error('이미지 다운로드 실패:', error)
  }
}

async function downloadAllImages() {
  try {
    downloadingAll.value = true
    
    const zip = new JSZip()
    
    let image_index = 1
    for (const image of images.value) {
      try {
        const response = await fetch(`http://127.0.0.1:3000/${image.saved_file_path}`)
        const blob = await response.blob()
        zip.file(`${image_index}.png`, blob)
        image_index += 1
      } catch (error) {
        console.error(`이미지 ${image.name} 다운로드 실패:`, error)
      }
    }
    
    const content = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.download = `${selectedResourceName.value}_images.zip`
    link.href = URL.createObjectURL(content)
    link.click()
  } catch (error) {
    console.error('모든 이미지 다운로드 실패:', error)
  } finally {
    downloadingAll.value = false
  }
}

function showImageDetails(image) {
  selectedImageDetail.value = image
  imageDetailDialog.value = true
}

function handleImageError(event) {
  event.target.style.display = 'none'
}

// 음성 재생 관련
function toggleAudio(index) {
  const audio = audioRefs.value[index]
  if (!audio) return
  
  if (playingAudio.value === index) {
    audio.pause()
    playingAudio.value = null
  } else {
    // 다른 오디오 중지
    if (playingAudio.value !== null && audioRefs.value[playingAudio.value]) {
      audioRefs.value[playingAudio.value].pause()
    }
    
    audio.play()
    playingAudio.value = index
    
    audio.onended = () => {
      playingAudio.value = null
    }
  }
}

async function downloadVoice(voice) {
  try {
    const response = await fetch(`http://127.0.0.1:3000/${voice.saved_file_path}`)
    const blob = await response.blob()
    const link = document.createElement('a')

    const voice_name = voice.saved_file_path.split('/').pop().split('.')[0]
    link.download = `${voice_name}.wav`
    link.href = URL.createObjectURL(blob)
    link.click()
  } catch (error) {
    console.error('음성 다운로드 실패:', error)
  }
}

async function downloadAllVoices() {
  try {
    downloadingAll.value = true
    
    const zip = new JSZip()
    
    let voice_index = 1
    for (const voice of voices.value) {
      try {
        const response = await fetch(`http://127.0.0.1:3000/${voice.saved_file_path}`)
        const blob = await response.blob()
        zip.file(`${voice_index}.wav`, blob)
        voice_index += 1
      } catch (error) {
        console.error(`음성 ${voice.name} 다운로드 실패:`, error)
      }
    }
    
    const content = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.download = `${selectedResourceName.value}_voices.zip`
    link.href = URL.createObjectURL(content)
    link.click()
  } catch (error) {
    console.error('모든 음성 다운로드 실패:', error)
  } finally {
    downloadingAll.value = false
  }
}

function updateAudioDuration(index) {
  // 오디오 메타데이터 로드 완료 처리
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

.page-subtitle {
  font-size: 16px;
  color: #7f8c8d;
  margin: 0;
  opacity: 0.8;
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

/* 관리 섹션 공통 */
.management-section {
  padding: 32px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

/* 장면 관리 */
.scenes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.scene-card {
  background: rgba(255,255,255,0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 16px !important;
  transition: all 0.3s ease;
  overflow: hidden;
}

.scene-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.scene-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: rgba(102, 126, 234, 0.1);
  border-bottom: 1px solid rgba(255,255,255,0.3);
}

.scene-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.scene-content {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
  border-radius: 0 0 16px 16px;
}

/* 이미지 관리 */
.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.image-card {
  background: rgba(255,255,255,0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 16px !important;
  transition: all 0.3s ease;
  overflow: hidden;
}

.image-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-card:hover .image-preview {
  transform: scale(1.05);
}

.download-overlay-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-card:hover .download-overlay-btn {
  opacity: 1;
}

.image-info {
  padding: 16px 20px;
  text-align: center;
}

.image-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.image-detail {
  font-size: 14px;
  color: #7f8c8d;
  margin: 4px 0;
}

.image-actions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}

/* 음성 관리 */
.voices-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.voice-card {
  background: rgba(255,255,255,0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 16px !important;
  transition: all 0.3s ease;
}

.voice-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.voice-content {
  padding: 20px;
}

.voice-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.voice-info {
  flex: 1;
}

.voice-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.voice-text {
  font-size: 14px;
  color: #34495e;
  margin: 0 0 12px 0;
  font-style: italic;
}

.voice-emotions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.emotion-chip {
  font-size: 12px;
}

.voice-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 데이터 테이블 */
.data-table {
  background: rgba(255,255,255,0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.4) !important;
  border-radius: 16px !important;
  overflow: hidden;
  color: black;
}

/* 빈 상태 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 64px;
  text-align: center;
}

.empty-content {
  max-width: 400px;
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

/* 로딩 오버레이 */
.loading-overlay {
  background: rgba(255,255,255,0.9) !important;
  backdrop-filter: blur(10px);
}

.loading-content {
  text-align: center;
}

.loading-text {
  margin: 16px 0 0 0;
  font-size: 16px;
  color: #2c3e50;
  font-weight: 500;
}

/* 상세 정보 다이얼로그 */
.v-dialog .v-card {
  background: rgba(255,255,255,0.9) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.1), 0 8px 32px rgba(102, 126, 234, 0.2) !important;
  overflow: hidden;
  color: black;
}

.v-dialog .v-card-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  font-weight: 600;
  font-size: 18px;
  margin: 0;
}

.v-dialog .v-card-text {
  padding: 24px;
  background: transparent;
}

.v-dialog .v-card-actions {
  background: rgba(102, 126, 234, 0.05);
  padding: 16px 24px;
  border-top: 1px solid rgba(255,255,255,0.3);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.detail-item {
  padding: 16px;
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.detail-item:hover {
  background: rgba(102, 126, 234, 0.12);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.detail-item strong {
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.prompt-text {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #34495e;
  background: rgba(255,255,255,0.8);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.5);
  backdrop-filter: blur(10px);
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.prompt-text::-webkit-scrollbar {
  width: 8px;
}

.prompt-text::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.prompt-text::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.prompt-text::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
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
  
  .management-section {
    padding: 16px;
  }

  .menu-card {
    margin-bottom: 16px;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }

  .scenes-grid {
    grid-template-columns: 1fr;
  }

  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 600px) {
  .page-title {
    font-size: 24px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .images-grid {
    grid-template-columns: 1fr;
  }

  .voice-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style> 