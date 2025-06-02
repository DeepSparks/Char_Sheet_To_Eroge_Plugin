<template>
  <v-container fluid class="global-note-container">
    <div class="global-note-header">
      <h1 class="page-title">
        <v-icon class="title-icon">mdi-note-text</v-icon>
        글로벌 노트 생성기
      </h1>
    </div>

    <v-row no-gutters class="global-note-content">
      <!-- 좌측 옵션 선택 패널 -->
      <v-col cols="4" class="options-column">
        <v-card class="options-card" elevation="0">
          <v-card-title class="options-title">
            <v-icon class="mr-2">mdi-tune-variant</v-icon>
            구성 요소 선택
          </v-card-title>
          
          <v-card-text class="options-content">
            <!-- 기본 정보 -->
            <div class="option-group">
              <div class="group-header">
                <v-icon class="group-header-icon">mdi-star</v-icon>
                <h3 class="group-header-title">기본 구성 요소</h3>
                <div class="group-header-line"></div>
              </div>
              <div class="basic-info">
                <v-chip 
                  class="basic-chip" 
                  color="primary" 
                  variant="tonal"
                  size="small"
                >
                  항상 포함
                </v-chip>
                <p class="basic-description">
                  Start, Definitions, Scenes, End 태그는 기본적으로 포함됩니다.
                </p>
              </div>
            </div>

            <!-- 선택 가능한 구성 요소 -->
            <div class="option-group">
              <div class="group-header">
                <v-icon class="group-header-icon">mdi-check-circle-outline</v-icon>
                <h3 class="group-header-title">선택 구성 요소</h3>
                <div class="group-header-line"></div>
              </div>
              
              <div class="option-items">
                <div 
                  v-for="option in options" 
                  :key="option.key" 
                  class="option-item"
                >
                  <div class="option-toggle">
                    <v-switch
                      v-model="option.enabled"
                      :color="option.color"
                      class="option-switch"
                      hide-details
                      density="compact"
                      @change="generatePrompt"
                    />
                    <div class="option-info">
                      <h4 class="option-title">{{ option.title }}</h4>
                      <p class="option-description">{{ option.description }}</p>
                    </div>
                  </div>
                  <v-icon 
                    :class="['option-icon', { 'active': option.enabled }]"
                    :color="option.enabled ? option.color : 'grey-lighten-1'"
                  >
                    {{ option.icon }}
                  </v-icon>
                </div>
              </div>
            </div>

            <!-- 추가 지시 요소 -->
            <div class="option-group">
              <div class="group-header">
                <v-icon class="group-header-icon">mdi-cog-outline</v-icon>
                <h3 class="group-header-title">추가 지시 요소</h3>
                <div class="group-header-line"></div>
              </div>
              
              <div class="option-items">
                <div 
                  v-for="option in additionalOptions" 
                  :key="option.key" 
                  class="option-item"
                >
                  <div class="option-toggle">
                    <v-switch
                      v-model="option.enabled"
                      :color="option.color"
                      class="option-switch"
                      hide-details
                      density="compact"
                      @change="generatePrompt"
                    />
                    <div class="option-info">
                      <h4 class="option-title">{{ option.title }}</h4>
                      <p class="option-description">{{ option.description }}</p>
                      <!-- 캐릭터 수 제한 설정 -->
                      <div v-if="option.key === 'charLimit' && option.enabled" class="char-limit-control">
                        <v-text-field
                          v-model.number="characterLimit"
                          type="number"
                          min="1"
                          max="10"
                          variant="outlined"
                          density="compact"
                          hide-details
                          class="char-limit-input"
                          @input="generatePrompt"
                        >
                          <template #prepend-inner>
                            <span class="input-label" style="width: 30px;">최대</span>
                          </template>
                          <template #append-inner>
                            <span class="input-label">명</span>
                          </template>
                        </v-text-field>
                      </div>
                    </div>
                  </div>
                  <v-icon 
                    :class="['option-icon', { 'active': option.enabled }]"
                    :color="option.enabled ? option.color : 'grey-lighten-1'"
                  >
                    {{ option.icon }}
                  </v-icon>
                </div>
              </div>
            </div>

            <!-- 액션 버튼들 -->
            <div class="action-buttons">
              <v-btn
                @click="resetToDefaults"
                variant="outlined"
                color="secondary"
                class="action-btn"
                prepend-icon="mdi-restore"
              >
                기본값 복원
              </v-btn>
              <v-btn
                @click="selectAll"
                variant="elevated"
                color="primary"
                class="action-btn"
                prepend-icon="mdi-select-all"
              >
                전체 선택
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 우측 프롬프트 미리보기 -->
      <v-col cols="8" class="preview-column">
        <v-card class="preview-card" elevation="0">
          <v-card-title class="preview-title">
            <v-icon class="mr-2">mdi-eye</v-icon>
            생성된 프롬프트 미리보기
            <v-spacer></v-spacer>
            <v-chip 
              class="preview-count" 
              color="secondary" 
              variant="tonal"
              size="small"
            >
              {{ selectedCount }}개 구성 요소 선택됨
            </v-chip>
          </v-card-title>
          
          <v-card-text class="preview-content">
            <div class="preview-area">
              <div class="preview-wrapper">
                <v-textarea
                  v-model="generatedPrompt"
                  class="prompt-textarea"
                  variant="outlined"
                  readonly
                  auto-grow
                  :rows="20"
                  hide-details
                />
                
                <div class="copy-overlay">
                  <v-btn
                    @click="copyToClipboard"
                    :color="copySuccess ? 'success' : 'primary'"
                    :variant="copySuccess ? 'tonal' : 'elevated'"
                    class="copy-btn"
                    :prepend-icon="copySuccess ? 'mdi-check' : 'mdi-content-copy'"
                    size="large"
                  >
                    {{ copySuccess ? '복사됨!' : '클립보드에 복사' }}
                  </v-btn>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  baseSection, 
  statusSection, 
  imageSection, 
  voiceSection, 
  eventSection,
  endSection,
  narrativeSection,
  exampleStatusPart,
  exampleImagePart,
  exampleVoicePart,
  exampleSceneEnd,
  exampleImagePartSceneEnd,
  exampleEventPart,
  exampleEnd,
  exampleNoStatusPart,
  exampleNoVoicePart,
  important_char_count_limit
} from '@/constants/global_note'

// 옵션 설정
const options = ref([
  {
    key: 'status',
    title: '상태 태그 포함',
    description: '시간, 위치 정보를 포함하는 상태 태그',
    icon: 'mdi-map-marker-time',
    color: 'indigo',
    enabled: false
  },
  {
    key: 'image',
    title: '이미지 생성 태그 포함',
    description: '캐릭터, 스타일, 배경 정의 및 씬 태그',
    icon: 'mdi-image-multiple',
    color: 'purple',
    enabled: true // 기본 활성화
  },
  {
    key: 'voice',
    title: '음성 태그 포함',
    description: '캐릭터 대화와 감정 표현을 위한 음성 태그',
    icon: 'mdi-account-voice',
    color: 'teal',
    enabled: false
  },
  {
    key: 'event',
    title: '이벤트 옵션 선택 태그 포함',
    description: '스토리 진행을 위한 이벤트 옵션 태그',
    icon: 'mdi-lightning-bolt',
    color: 'orange',
    enabled: false
  }
])

// 추가 지시 요소 옵션
const additionalOptions = ref([
  {
    key: 'charLimit',
    title: '캐릭터 수 제한 설정',
    description: '스토리에 등장할 수 있는 최대 캐릭터 수를 제한해서 과도한 캐릭터 생성을 방지합니다.',
    icon: 'mdi-account-multiple-outline',
    color: 'red',
    enabled: false
  }
])

// 상태 관리
const generatedPrompt = ref('')
const copySuccess = ref(false)
const characterLimit = ref(3) // 기본값 3

// 계산된 속성
const selectedCount = computed(() => {
  return options.value.filter(option => option.enabled).length
})

// 메서드들
function generatePrompt() {
  let sections = []
  let exampleParts = []
  
  // 1. Start Tag (항상 포함)
  sections.push(baseSection)
  
  // 2. Status Tags (선택적)
  if (options.value.find(o => o.key === 'status' && o.enabled)) {
    sections.push(statusSection)
  }
  
  // 3. Image Generation Tags (선택적)
  if (options.value.find(o => o.key === 'image' && o.enabled)) {
    sections.push(imageSection)
  }
  
  // 4. Voice Tag (선택적)
  if (options.value.find(o => o.key === 'voice' && o.enabled)) {
    sections.push(voiceSection)
  }
  
  // 5. Event Options Select Tags (선택적)
  if (options.value.find(o => o.key === 'event' && o.enabled)) {
    sections.push(eventSection)
  }
  
  // 6. End Tag (항상 포함)
  sections.push(endSection)
  
  // 7. Narrative Structure (항상 포함)
  sections.push(narrativeSection)
  
  // 8. Example Format 시작
  sections.push('\n#### 8. Example Format\n```')
  
  // 예시 부분 추가
  if (options.value.find(o => o.key === 'status' && o.enabled)) {
    exampleParts.push(exampleStatusPart)
  } else {
    exampleParts.push(exampleNoStatusPart)
  }
  
  if (options.value.find(o => o.key === 'image' && o.enabled)) {
    exampleParts.push(exampleImagePart)
  }
  
  if (options.value.find(o => o.key === 'voice' && o.enabled)) {
    exampleParts.push(exampleVoicePart)
  } else {
    exampleParts.push(exampleNoVoicePart)
  }

  if(options.value.find(o => o.key === 'image' && o.enabled)) {
    exampleParts.push(exampleImagePartSceneEnd)
  }
  
  // 씬 마무리 (항상 포함)
  if (options.value.find(o => o.key === 'image' && o.enabled)) {
    exampleParts.push(exampleSceneEnd)
  } else {
    exampleParts.push('\n<Definitions>\n...\n</Definitions>\n\n<Scenes>\n...\n</Scenes>')
  }
  
  if (options.value.find(o => o.key === 'event' && o.enabled)) {
    exampleParts.push(exampleEventPart)
  }
  
  exampleParts.push(exampleEnd)
  
  sections.push(exampleParts.join('\n'))
  
  // 9. Important 섹션 (가장 마지막에 추가)
  if (additionalOptions.value.find(o => o.key === 'charLimit' && o.enabled)) {
    const charLimitSection = important_char_count_limit.replace(/{NUMBER}/g, characterLimit.value)
    sections.push(charLimitSection)
  }
  
  generatedPrompt.value = sections.join('\n\n')
}

function resetToDefaults() {
  options.value.forEach(option => {
    option.enabled = option.key === 'image' // 이미지 생성 태그만 기본 활성화
  })
  additionalOptions.value.forEach(option => {
    option.enabled = false // 추가 지시 요소는 모두 비활성화
  })
  characterLimit.value = 3 // 기본값으로 리셋
  generatePrompt()
}

function selectAll() {
  options.value.forEach(option => {
    option.enabled = true
  })
  additionalOptions.value.forEach(option => {
    option.enabled = true
  })
  generatePrompt()
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(generatedPrompt.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (error) {
    console.error('클립보드 복사 실패:', error)
  }
}

// 컴포넌트 마운트 시 프롬프트 생성
onMounted(() => {
  generatePrompt()
})
</script>

<style scoped>
.global-note-container {
  background: transparent;
  padding: 0;
  min-height: calc(100vh - 120px);
}

.global-note-header {
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

.global-note-content {
  padding: 0 24px;
  gap: 24px;
  display: flex !important;
  flex-direction: row !important;
  align-items: flex-start;
}

.options-column {
  padding-right: 12px;
  flex: 0 0 33% !important;
  max-width: 33% !important;
}

.preview-column {
  padding-left: 12px;
  flex: 1 !important;
  max-width: 67% !important;
}

.options-card, .preview-card {
  background: rgba(255,255,255,0.7) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 16px !important;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}

.options-title, .preview-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
  font-weight: 600;
  font-size: 16px;
}

.options-content {
  padding: 24px;
}

.option-group {
  margin-bottom: 32px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.group-header-icon {
  color: #667eea;
  font-size: 24px;
}

.group-header-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.group-header-line {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right, rgba(102, 126, 234, 0.3), transparent);
  border-radius: 1px;
}

.basic-info {
  padding: 16px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.basic-chip {
  margin-bottom: 8px;
}

.basic-description {
  font-size: 14px;
  color: #5a6c7d;
  margin: 0;
  line-height: 1.4;
}

.option-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: rgba(255,255,255,0.6);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.8);
  transition: all 0.3s ease;
}

.option-item:hover {
  background: rgba(255,255,255,0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.option-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.option-switch {
  flex-shrink: 0;
}

.option-info {
  flex: 1;
}

.option-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.option-description {
  font-size: 13px;
  color: #7f8c8d;
  margin: 0;
  line-height: 1.3;
}

.option-icon {
  transition: all 0.3s ease;
  font-size: 24px;
}

.option-icon.active {
  transform: scale(1.1);
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.action-btn {
  flex: 1;
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
}

.preview-content {
  padding: 24px;
}

.preview-count {
  font-weight: 500;
}

.preview-area {
  position: relative;
}

.preview-wrapper {
  position: relative;
}

.prompt-textarea {
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.5;
}

.prompt-textarea :deep(.v-field__field) {
  background: rgba(248, 250, 252, 0.9);
  border-radius: 12px;
}

.prompt-textarea :deep(textarea) {
  color: #2c3e50 !important;
}

.copy-overlay {
  position: absolute;
  top: 16px;
  right: 16px;
}

.copy-btn {
  backdrop-filter: blur(10px);
  border-radius: 12px;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

/* 스크롤바 스타일링 */
.preview-content::-webkit-scrollbar {
  width: 12px;
}

.preview-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin: 8px;
}

.preview-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%);
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
  border-color: rgba(255, 255, 255, 0.5);
}

/* 반응형 디자인 */
@media (max-width: 1200px) {
  .global-note-content {
    flex-direction: column !important;
    gap: 16px;
  }
  
  .options-column, .preview-column {
    padding: 0;
    flex: 1 1 auto !important;
    max-width: 100% !important;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}

.char-limit-control {
  margin-top: 12px;
  width: 140px;
}

.char-limit-input {
  font-size: 14px;
  color: black;
}

.char-limit-input :deep(.v-field__field) {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
}

.input-label {
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 500;
}
</style> 