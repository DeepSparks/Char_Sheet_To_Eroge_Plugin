<template>
  <v-container fluid class="settings-container">
    <div class="settings-header">
      <h1 class="page-title">
        <v-icon class="title-icon">mdi-cog</v-icon>
        시스템 설정
      </h1>
    </div>

    <v-row no-gutters class="settings-content">
      <!-- 좌측 설정 그룹 메뉴 -->
      <v-col cols="3" class="menu-column">
        <v-card class="menu-card" elevation="0">
          <v-card-title class="menu-title">
            <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
            설정 그룹
          </v-card-title>
          <v-list density="compact" class="group-list">
            <v-list-item
              v-for="group in configGroups"
              :key="group.group_id"
              :active="selectedGroupId === group.group_id"
              @click="selectGroup(group.group_id)"
              class="group-item"
            >
              <template v-slot:prepend>
                <v-icon class="group-icon">mdi-folder-cog</v-icon>
              </template>
              <v-list-item-title class="group-title">{{ group.group_alias }}</v-list-item-title>
              <template v-slot:append>
                <v-icon v-if="selectedGroupId === group.group_id" class="active-indicator">
                  mdi-chevron-right
                </v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <!-- 우측 설정 폼 -->
      <v-col cols="9" class="content-column">
        <div class="content-area">
          <div v-if="selectedGroup" class="config-section">
            <div class="section-header">
              <h2 class="section-title">{{ selectedGroup.group_alias }}</h2>
            </div>
            
            <!-- 기본 설정들 -->
            <div v-if="basicConfigs.length > 0" class="config-group">
              <div class="group-header">
                <v-icon class="group-header-icon">mdi-tune</v-icon>
                <h3 class="group-header-title">기본 설정</h3>
                <div class="group-header-line"></div>
              </div>
              <v-card class="config-card basic-card" elevation="0">
                <v-card-text class="config-card-content">
                  <div v-for="config in basicConfigs" :key="config.config_id" class="config-wrapper">
                    <ConfigItem 
                      :config="config" 
                      :all-configs="allConfigs"
                      @update="updateConfig" 
                    />
                  </div>
                </v-card-text>
              </v-card>
            </div>

            <!-- 고급 설정들 -->
            <div v-if="advancedConfigs.length > 0" class="config-group">
              <v-expansion-panels class="advanced-panels" variant="accordion">
                <v-expansion-panel class="advanced-panel">
                  <v-expansion-panel-title class="advanced-title">
                    <div class="advanced-title-content">
                      <v-icon class="advanced-icon">mdi-cog-outline</v-icon>
                      <span class="advanced-text">고급 설정</span>
                      <v-chip 
                        class="advanced-count" 
                        color="secondary" 
                        variant="tonal"
                        size="x-small"
                      >
                        {{ advancedConfigs.length }}
                      </v-chip>
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="advanced-content">
                    <div v-for="config in advancedConfigs" :key="config.config_id" class="config-wrapper">
                      <ConfigItem 
                        :config="config" 
                        :all-configs="allConfigs"
                        @update="updateConfig" 
                      />
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>

          <!-- 선택된 그룹이 없을 때 -->
          <div v-else class="empty-state">
            <div class="empty-content">
              <v-icon class="empty-icon" size="120">mdi-cog-outline</v-icon>
              <h3 class="empty-title">설정 그룹을 선택하세요</h3>
              <p class="empty-subtitle">좌측 메뉴에서 편집하고 싶은 설정 그룹을 선택해주세요</p>
              <v-btn 
                v-if="configGroups.length > 0"
                @click="selectGroup(configGroups[0].group_id)"
                color="primary"
                variant="elevated"
                class="empty-action"
              >
                <v-icon start>mdi-play</v-icon>
                시작하기
              </v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ApiService } from '@/utils/api'
import ConfigItem from '@/components/ConfigItem.vue'

// 상태 관리
const configData = ref(null)
const selectedGroupId = ref(null)

// 계산된 속성들
const configGroups = computed(() => {
  return configData.value?.configs || []
})

const selectedGroup = computed(() => {
  if (!selectedGroupId.value || !configGroups.value) return null
  return configGroups.value.find(group => group.group_id === selectedGroupId.value)
})

const allConfigs = computed(() => {
  if (!selectedGroup.value) return []
  return selectedGroup.value.configs || []
})

const basicConfigs = computed(() => {
  return allConfigs.value.filter(config => 
    !config.is_advanced && isConfigVisible(config)
  )
})

const advancedConfigs = computed(() => {
  return allConfigs.value.filter(config => 
    config.is_advanced && isConfigVisible(config)
  )
})

// 메서드들
function selectGroup(groupId) {
  selectedGroupId.value = groupId
}

function isConfigVisible(config) {
  if (!config.config_if_conditions) return true
  
  return config.config_if_conditions.every(condition => {
    const targetConfig = allConfigs.value.find(c => c.config_id === condition.config_id)
    return targetConfig && targetConfig.value === condition.config_value
  })
}

async function updateConfig(configId, newValue) {
  try {
    // 로딩 상태를 전체 화면이 아닌 개별 설정 항목에만 적용하도록 변경
    const config = {}
    config[configId] = newValue
    
    // 먼저 로컬 상태를 즉시 업데이트 (반응성 개선)
    const targetConfig = allConfigs.value.find(c => c.config_id === configId)
    if (targetConfig) {
      targetConfig.value = newValue
    }
    
    // 백그라운드에서 API 호출
    await ApiService.setConfig(config)
    
  } catch (error) {
    console.error('설정 업데이트 실패:', error)
    // 에러 발생시 이전 값으로 롤백
    const targetConfig = allConfigs.value.find(c => c.config_id === configId)
    if (targetConfig) {
      await loadConfig() // 서버에서 최신 데이터 다시 로드
    }
    // TODO: 에러 토스트 메시지 표시
  }
}

async function loadConfig() {
  try {
    const response = await ApiService.getConfigInfo()
    configData.value = response
    
    // 첫 번째 그룹을 기본 선택
    if (configGroups.value.length > 0) {
      selectedGroupId.value = configGroups.value[0].group_id
    }
  } catch (error) {
    console.error('설정 로딩 실패:', error)
    // TODO: 에러 토스트 메시지 표시
  } finally {
  }
}

// 컴포넌트 마운트 시 설정 로드
onMounted(() => {
  loadConfig()
})
</script>

<style scoped>
.settings-container {
  background: transparent;
  padding: 0;
  min-height: calc(100vh - 120px);
}

.settings-header {
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

.settings-content {
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

.group-item :deep(.v-list-item__content) {
  color: #2c3e50 !important;
}

.group-item :deep(.v-list-item-title) {
  color: #2c3e50 !important;
  font-weight: 500 !important;
}

.group-item:hover {
  background: rgba(102, 126, 234, 0.1) !important;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.group-item:hover :deep(.v-list-item__content),
.group-item:hover :deep(.v-list-item-title) {
  color: #667eea !important;
}

.group-item.v-list-item--active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%) !important;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.group-item.v-list-item--active :deep(.v-list-item__content),
.group-item.v-list-item--active :deep(.v-list-item-title) {
  color: #667eea !important;
  font-weight: 600 !important;
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

/* === 추가된 스크롤바 스타일링 === */
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
  transform: scale(1.05);
}

.content-area::-webkit-scrollbar-thumb:active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
/* === 스크롤바 스타일링 끝 === */

.config-section {
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

.config-count-chip {
  font-weight: 500;
}

.config-group {
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
  font-size: 20px;
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

.config-card {
  background: rgba(255,255,255,0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.config-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.config-card-content {
  padding: 24px;
}

.config-wrapper {
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255,255,255,0.5);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.6);
  transition: all 0.3s ease;
}

.config-wrapper:hover {
  background: rgba(255,255,255,0.8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.config-wrapper:last-child {
  margin-bottom: 0;
}

.advanced-panels {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.advanced-panel {
  background: rgba(255,255,255,0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.4) !important;
}

.advanced-title {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white !important;
  font-weight: 600;
}

.advanced-title-content {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.advanced-icon {
  color: white;
}

.advanced-text {
  flex: 1;
  font-size: 16px;
}

.advanced-count {
  background: rgba(255,255,255,0.2) !important;
  color: white !important;
}

.advanced-content {
  background: rgba(255,255,255,0.6);
  padding: 24px !important;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 600px;
  padding: 64px;
}

.empty-content {
  text-align: center;
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
  margin: 0 0 32px 0;
  line-height: 1.5;
}

.empty-action {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

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
  .settings-content {
    flex-direction: column !important;
    gap: 16px;
  }
  
  .menu-column, .content-column {
    padding: 0;
    flex: 1 1 auto !important;
    max-width: 100% !important;
  }
  
  .config-section {
    padding: 16px;
  }

  .menu-card {
    margin-bottom: 16px;
  }
}
</style> 