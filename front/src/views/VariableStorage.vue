<template>
  <v-container fluid class="variable-storage-container">
    <div class="variable-storage-header">
      <h1 class="page-title">
        <v-icon class="title-icon">mdi-code-brackets</v-icon>
        변수 저장소
      </h1>
    </div>

    <div class="variables-content">
      <div v-if="variables.length === 0" class="empty-state">
        <div class="empty-content">
          <v-icon class="empty-icon" size="120">mdi-database-off</v-icon>
          <h3 class="empty-title">변수가 없습니다</h3>
          <p class="empty-subtitle">아직 정의된 변수가 없습니다</p>
        </div>
      </div>

      <div v-else class="variables-grid">
        <v-card
          v-for="(variable, index) in variables"
          :key="index"
          class="variable-card"
          elevation="0"
        >
          <v-card-title class="variable-title">
            <v-icon class="variable-icon">mdi-code-json</v-icon>
            <span class="title-text">{{ variable.title }}</span>
            <v-spacer></v-spacer>
            <v-btn
              @click="copyToClipboard(variable.value, index)"
              :loading="copyingIndex === index"
              color="primary"
              variant="elevated"
              size="small"
              class="copy-button"
            >
              <v-icon start>{{ copySuccess && copiedIndex === index ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
              {{ copySuccess && copiedIndex === index ? '복사됨' : '복사' }}
            </v-btn>
          </v-card-title>

          <v-card-text class="variable-content">
            <div class="description-section">
              <h4 class="section-label">
                <v-icon class="section-icon">mdi-information-outline</v-icon>
                설명
              </h4>
              <p class="description-text">{{ variable.description }}</p>
            </div>

            <div class="value-section">
              <h4 class="section-label">
                <v-icon class="section-icon">mdi-code-tags</v-icon>
                값
                <v-chip class="value-length-chip" size="x-small" variant="tonal">
                  {{ variable.value.length }} 글자
                </v-chip>
              </h4>
              <div class="value-container">
                <pre class="value-display">{{ variable.value }}</pre>
                <div class="value-overlay">
                  <v-btn
                    @click="copyToClipboard(variable.value, index)"
                    :loading="copyingIndex === index"
                    color="primary"
                    variant="tonal"
                    size="small"
                    class="overlay-copy-button"
                  >
                    <v-icon>{{ copySuccess && copiedIndex === index ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <!-- 성공 스낵바 -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      color="success"
      location="bottom right"
      class="success-snackbar"
    >
      <v-icon start>mdi-check-circle</v-icon>
      클립보드에 복사되었습니다!
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { variables } from '@/constants/variables'

// 상태 관리
const copyingIndex = ref(null)
const copySuccess = ref(false)
const copiedIndex = ref(null)
const showSnackbar = ref(false)

// 클립보드 복사 함수
async function copyToClipboard(text, index) {
  try {
    copyingIndex.value = index
    
    await navigator.clipboard.writeText(text)
    
    copySuccess.value = true
    copiedIndex.value = index
    showSnackbar.value = true
    
    // 성공 상태를 2초 후 리셋
    setTimeout(() => {
      copySuccess.value = false
      copiedIndex.value = null
    }, 2000)
    
  } catch (error) {
    console.error('클립보드 복사 실패:', error)
    // 에러 처리 - 대체 방법 시도
    fallbackCopyToClipboard(text)
  } finally {
    copyingIndex.value = null
  }
}

// 클립보드 API를 지원하지 않는 경우의 대체 방법
function fallbackCopyToClipboard(text) {
  try {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    showSnackbar.value = true
  } catch (error) {
    console.error('대체 클립보드 복사도 실패:', error)
  }
}
</script>

<style scoped>
.variable-storage-container {
  background: transparent;
  padding: 0;
  min-height: calc(100vh - 120px);
}

.variable-storage-header {
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

.variables-content {
  padding: 0 24px;
}

.variables-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: 1fr;
}

.variable-card {
  background: rgba(255,255,255,0.7) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  overflow: hidden;
}

.variable-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.3);
}

.variable-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.variable-icon {
  color: white;
  font-size: 24px;
}

.title-text {
  flex: 1;
}

.copy-button {
  background: rgba(255,255,255,0.2) !important;
  color: white !important;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

.copy-button:hover {
  background: rgba(255,255,255,0.3) !important;
  transform: scale(1.05);
}

.variable-content {
  padding: 32px;
  background: rgba(255,255,255,0.8);
}

.description-section {
  margin-bottom: 32px;
}

.value-section {
  margin-bottom: 0;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.section-icon {
  color: #667eea;
  font-size: 20px;
}

.value-length-chip {
  background: rgba(102, 126, 234, 0.1) !important;
  color: #667eea !important;
  margin-left: 8px;
}

.description-text {
  font-size: 15px;
  color: #34495e;
  line-height: 1.6;
  margin: 0;
  padding: 16px;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.8);
}

.value-container {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(102, 126, 234, 0.2);
  background: rgba(248, 249, 250, 0.8);
}

.value-display {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #2c3e50;
  background: transparent;
  margin: 0;
  padding: 20px;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 300px;
  overflow-y: auto;
}

.value-display::-webkit-scrollbar {
  width: 8px;
}

.value-display::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.value-display::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.3);
  border-radius: 4px;
}

.value-display::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.5);
}

.value-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.value-container:hover .value-overlay {
  opacity: 1;
}

.overlay-copy-button {
  background: rgba(255,255,255,0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.overlay-copy-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.empty-content {
  text-align: center;
  max-width: 400px;
  padding: 64px;
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

.success-snackbar {
  font-weight: 500;
}

/* 애니메이션 */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* 반응형 디자인 */
@media (min-width: 960px) {
  .variables-grid {
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
  }
}

@media (max-width: 768px) {
  .variable-storage-header {
    padding: 24px 20px;
  }
  
  .variables-content {
    padding: 0 16px;
  }
  
  .variable-content {
    padding: 24px 20px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .copy-button {
    font-size: 12px;
    padding: 0 12px;
  }
  
  .value-display {
    font-size: 12px;
    padding: 16px;
  }
}
</style> 