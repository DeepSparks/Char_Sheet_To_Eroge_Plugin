<template>
  <div class="management-section">
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
            style="color: black;"
          />
        </div>
        <div 
          :ref="el => sceneRefs[index] = el"
          class="scene-content"
          v-html="preprocessHtml(scene.renderedHTML)"
        />
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watchEffect } from 'vue'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'

// Props
const props = defineProps({
  selectedResourceName: {
    type: String,
    required: true
  },
  renderedHTMLs: {
    type: Array,
    default: () => []
  }
})

// 상태 관리
const downloadingAll = ref(false)
const downloadingScenes = ref([])
const sceneRefs = ref([])

// Props 변경 시 downloadingScenes 배열 업데이트
watchEffect(() => {
  downloadingScenes.value = new Array(props.renderedHTMLs.length).fill(false)
})

// 메서드들
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
    link.download = `${props.selectedResourceName}_${scene.sequence_id}.png`
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
    
    for (let i = 0; i < props.renderedHTMLs.length; i++) {
      const scene = props.renderedHTMLs[i]
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
    link.download = `${props.selectedResourceName}_scenes.zip`
    link.href = URL.createObjectURL(content)
    link.click()
  } catch (error) {
    console.error('모든 장면 다운로드 실패:', error)
  } finally {
    downloadingAll.value = false
  }
}

function preprocessHtml(html) {
  return html
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

.scenes-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.scene-card {
  background: rgba(255,255,255,0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 16px !important;
  transition: all 0.3s ease;
  overflow: hidden;
  width: 1260px;
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
  overflow-y: auto;
  border-radius: 0 0 16px 16px;
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

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
