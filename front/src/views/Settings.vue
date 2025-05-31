<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters style="height: calc(100vh - 120px);">
      <!-- 좌측 설정 그룹 메뉴 -->
      <v-col cols="3" style="border-right: 1px solid rgba(255,255,255,0.12);">
        <v-list density="compact" class="pa-0">
          <v-list-item
            v-for="group in configGroups"
            :key="group.group_id"
            :active="selectedGroupId === group.group_id"
            @click="selectGroup(group.group_id)"
            class="px-4 py-3"
          >
            <v-list-item-title>{{ group.group_alias }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-col>

      <!-- 우측 설정 폼 -->
      <v-col cols="9">
        <div class="pa-6">
          <div v-if="selectedGroup">
            <h2 class="mb-4">{{ selectedGroup.group_alias }}</h2>
            
            <!-- 기본 설정들 -->
            <div v-if="basicConfigs.length > 0">
              <h3 class="mb-3">기본 설정</h3>
              <v-card variant="outlined" class="mb-6">
                <v-card-text>
                  <div v-for="config in basicConfigs" :key="config.config_id" class="mb-4">
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
            <div v-if="advancedConfigs.length > 0">
              <v-expansion-panels variant="accordion">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <span>고급 설정</span>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div v-for="config in advancedConfigs" :key="config.config_id" class="mb-4">
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
          <div v-else class="text-center py-8">
            <v-icon size="64" color="grey">mdi-cog</v-icon>
            <p class="mt-4 text-grey">좌측에서 설정 그룹을 선택해주세요</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 로딩 오버레이 -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ApiService } from '@/utils/api'
import ConfigItem from '@/components/ConfigItem.vue'

// 상태 관리
const loading = ref(false)
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
    loading.value = true
    
    const config = {}
    config[configId] = newValue
    await ApiService.setConfig(config)
    
    // 로컬 상태 업데이트
    const targetConfig = allConfigs.value.find(c => c.config_id === configId)
    if (targetConfig) {
      targetConfig.value = newValue
    }
    
  } catch (error) {
    console.error('설정 업데이트 실패:', error)
    // TODO: 에러 토스트 메시지 표시
  } finally {
    loading.value = false
  }
}

async function loadConfig() {
  try {
    loading.value = true
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
    loading.value = false
  }
}

// 컴포넌트 마운트 시 설정 로드
onMounted(() => {
  loadConfig()
})
</script>

<style scoped>
.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.12) !important;
}
</style> 