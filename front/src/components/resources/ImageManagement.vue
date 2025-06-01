<template>
  <div class="management-section">
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import JSZip from 'jszip'

// Props
const props = defineProps({
  selectedResourceName: {
    type: String,
    required: true
  },
  images: {
    type: Array,
    default: () => []
  }
})

// 상태 관리
const downloadingAll = ref(false)
const imageDetailDialog = ref(false)
const selectedImageDetail = ref(null)

// 메서드들
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
    for (const image of props.images) {
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
    link.download = `${props.selectedResourceName}_images.zip`
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
</script>

<style scoped>
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

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 960px) {
  .images-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 600px) {
  .images-grid {
    grid-template-columns: 1fr;
  }
}
</style>
