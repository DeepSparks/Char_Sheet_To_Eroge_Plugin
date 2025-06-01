<template>
  <div class="management-section">
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
                v-for="(value, emotion) in (voice.emotions || {})"
                :key="emotion"
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
  voices: {
    type: Array,
    default: () => []
  }
})

// 상태 관리
const downloadingAll = ref(false)
const playingAudio = ref(null)
const audioRefs = ref([])

// 메서드들
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
    for (const voice of props.voices) {
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
    link.download = `${props.selectedResourceName}_voices.zip`
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

@media (max-width: 600px) {
  .voice-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
