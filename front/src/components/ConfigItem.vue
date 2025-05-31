<template>
  <div class="config-item">
    <!-- Boolean 타입 -->
    <div v-if="config.config_type === 'boolean'">
      <v-switch
        :model-value="config.value"
        @update:model-value="handleUpdate"
        :label="config.config_alias"
        color="primary"
        hide-details="auto"
      />
      <div v-if="config.config_description" class="text-caption text-grey mt-1">
        {{ config.config_description }}
      </div>
    </div>

    <!-- Dropdown 타입 -->
    <div v-else-if="config.config_type === 'dropdown'">
      <v-select
        :model-value="config.value"
        @update:model-value="handleUpdate"
        :items="config.config_options"
        :label="config.config_alias"
        item-title="label"
        item-value="value"
        variant="outlined"
        density="compact"
        hide-details="auto"
      />
      <div v-if="config.config_description" class="text-caption text-grey mt-1">
        {{ config.config_description }}
      </div>
    </div>

    <!-- String 타입 -->
    <div v-else-if="config.config_type === 'string'">
      <v-textarea
        v-if="isLongText"
        :model-value="config.value"
        @update:model-value="handleUpdate"
        :label="config.config_alias"
        variant="outlined"
        density="compact"
        rows="3"
        auto-grow
        hide-details="auto"
      />
      <v-text-field
        v-else
        :model-value="config.value"
        @update:model-value="handleUpdate"
        :label="config.config_alias"
        :type="isPasswordField ? 'password' : 'text'"
        variant="outlined"
        density="compact"
        hide-details="auto"
      />
      <div v-if="config.config_description" class="text-caption text-grey mt-1">
        {{ config.config_description }}
      </div>
    </div>

    <!-- Number 타입 -->
    <div v-else-if="config.config_type === 'number'">
      <v-text-field
        :model-value="config.value"
        @update:model-value="handleNumberUpdate"
        :label="config.config_alias"
        type="number"
        variant="outlined"
        density="compact"
        hide-details="auto"
      />
      <div v-if="config.config_description" class="text-caption text-grey mt-1">
        {{ config.config_description }}
      </div>
    </div>

    <!-- 알 수 없는 타입 -->
    <div v-else>
      <v-alert type="warning" variant="tonal" density="compact">
        지원되지 않는 설정 타입: {{ config.config_type }}
      </v-alert>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  allConfigs: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update'])

// 계산된 속성들
const isLongText = computed(() => {
  if (props.config.config_type !== 'string') return false
  
  // 특정 키워드가 포함된 경우 긴 텍스트로 처리
  const longTextKeywords = ['prompt', 'keyword', 'negative', 'map', 'join']
  return longTextKeywords.some(keyword => 
    props.config.config_id.toLowerCase().includes(keyword) ||
    props.config.config_alias.toLowerCase().includes(keyword)
  )
})

const isPasswordField = computed(() => {
  if (props.config.config_type !== 'string') return false
  
  // API 키나 패스워드 관련 필드는 password 타입으로 처리
  const passwordKeywords = ['api_key', 'password', 'key', 'token']
  return passwordKeywords.some(keyword => 
    props.config.config_id.toLowerCase().includes(keyword)
  )
})

// 이벤트 핸들러들
function handleUpdate(newValue) {
  emit('update', props.config.config_id, newValue)
}

function handleNumberUpdate(newValue) {
  const numberValue = newValue === '' ? 0 : Number(newValue)
  emit('update', props.config.config_id, numberValue)
}
</script>

<style scoped>
.config-item {
  margin-bottom: 16px;
}

.config-item:last-child {
  margin-bottom: 0;
}
</style> 