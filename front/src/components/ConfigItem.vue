<template>
  <div class="config-item">
    <!-- Boolean 타입 -->
    <div v-if="config.config_type === 'boolean'" class="config-field boolean-field">
      <div class="field-header">
        <div class="field-label-wrapper">
          <v-icon class="field-icon">mdi-toggle-switch</v-icon>
          <span class="field-label">{{ config.config_alias }}</span>
        </div>
      </div>
      <v-switch
        :model-value="config.value"
        @update:model-value="handleUpdate"
        color="primary"
        hide-details="auto"
        class="custom-switch"
        inset
      />
      <div v-if="config.config_description" class="field-description">
        <v-icon size="14" class="description-icon">mdi-information-outline</v-icon>
        {{ config.config_description }}
      </div>
    </div>

    <!-- Dropdown 타입 -->
    <div v-else-if="config.config_type === 'dropdown'" class="config-field dropdown-field">
      <div class="field-header">
        <div class="field-label-wrapper">
          <v-icon class="field-icon">mdi-format-list-bulleted</v-icon>
          <span class="field-label">{{ config.config_alias }}</span>
        </div>
      </div>
      <v-select
        :model-value="config.value"
        @update:model-value="handleUpdate"
        :items="config.config_options"
        item-title="label"
        item-value="value"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
        class="custom-select"
        color="primary"
      >
        <template v-slot:prepend-inner>
          <v-icon class="input-icon">mdi-menu-down</v-icon>
        </template>
      </v-select>
      <div v-if="config.config_description" class="field-description">
        <v-icon size="14" class="description-icon">mdi-information-outline</v-icon>
        {{ config.config_description }}
      </div>
    </div>

    <!-- String 타입 -->
    <div v-else-if="config.config_type === 'string'" class="config-field string-field">
      <div class="field-header">
        <div class="field-label-wrapper">
          <v-icon class="field-icon">
            {{ isPasswordField ? 'mdi-key' : isLongText ? 'mdi-text' : 'mdi-form-textbox' }}
          </v-icon>
          <span class="field-label">{{ config.config_alias }}</span>
        </div>
      </div>
      <v-textarea
        v-if="isLongText"
        :model-value="config.value"
        @update:model-value="handleUpdate"
        variant="outlined"
        density="comfortable"
        rows="3"
        auto-grow
        hide-details="auto"
        class="custom-textarea"
        color="primary"
      >
        <template v-slot:prepend-inner>
          <v-icon class="input-icon">mdi-text</v-icon>
        </template>
      </v-textarea>
      <v-text-field
        v-else
        :model-value="config.value"
        @update:model-value="handleUpdate"
        :type="isPasswordField ? 'password' : 'text'"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
        class="custom-text-field"
        color="primary"
      >
        <template v-slot:prepend-inner>
          <v-icon class="input-icon">
            {{ isPasswordField ? 'mdi-key' : 'mdi-form-textbox' }}
          </v-icon>
        </template>
        <template v-if="isPasswordField" v-slot:append-inner>
          <v-icon class="security-indicator">mdi-shield-check</v-icon>
        </template>
      </v-text-field>
      <div v-if="config.config_description" class="field-description">
        <v-icon size="14" class="description-icon">mdi-information-outline</v-icon>
        {{ config.config_description }}
      </div>
    </div>

    <!-- Number 타입 -->
    <div v-else-if="config.config_type === 'number'" class="config-field number-field">
      <div class="field-header">
        <div class="field-label-wrapper">
          <v-icon class="field-icon">mdi-numeric</v-icon>
          <span class="field-label">{{ config.config_alias }}</span>
        </div>
      </div>
      <v-text-field
        :model-value="config.value"
        @update:model-value="handleNumberUpdate"
        type="number"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
        class="custom-number-field"
        color="primary"
      >
        <template v-slot:prepend-inner>
          <v-icon class="input-icon">mdi-numeric</v-icon>
        </template>
        <template v-slot:append-inner>
          <div class="number-controls">
            <v-btn 
              icon
              size="x-small"
              variant="text"
              @click="incrementNumber"
              class="number-btn"
            >
              <v-icon size="16">mdi-plus</v-icon>
            </v-btn>
            <v-btn 
              icon
              size="x-small"
              variant="text"
              @click="decrementNumber"
              class="number-btn"
            >
              <v-icon size="16">mdi-minus</v-icon>
            </v-btn>
          </div>
        </template>
      </v-text-field>
      <div v-if="config.config_description" class="field-description">
        <v-icon size="14" class="description-icon">mdi-information-outline</v-icon>
        {{ config.config_description }}
      </div>
    </div>

    <!-- 알 수 없는 타입 -->
    <div v-else class="config-field unknown-field">
      <v-alert 
        type="warning" 
        variant="tonal" 
        density="compact"
        class="custom-alert"
      >
        <template v-slot:prepend>
          <v-icon>mdi-alert-circle</v-icon>
        </template>
        <div class="alert-content">
          <strong>지원되지 않는 설정 타입</strong>
          <p class="mt-1 mb-0">{{ config.config_type }}는 현재 지원되지 않는 설정 유형입니다.</p>
        </div>
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
  
  // API 키는 password 타입으로 처리
  const passwordKeywords = ['api_key']
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

function incrementNumber() {
  const currentValue = Number(props.config.value) || 0
  emit('update', props.config.config_id, currentValue + 1)
}

function decrementNumber() {
  const currentValue = Number(props.config.value) || 0
  emit('update', props.config.config_id, Math.max(0, currentValue - 1))
}
</script>

<style scoped>
.config-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.config-field {
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}

.config-field:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%);
  border-color: rgba(102, 126, 234, 0.3);
}

.field-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.field-label-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-icon {
  color: #667eea !important;
  background: rgba(102, 126, 234, 0.1);
  padding: 6px;
  border-radius: 8px;
  font-size: 18px;
  transition: all 0.3s ease;
}

.config-field:hover .field-icon {
  color: #764ba2 !important;
  background: rgba(118, 75, 162, 0.15);
  transform: scale(1.05);
}

.field-label {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.status-chip {
  font-weight: 500;
  font-size: 11px;
  height: 20px;
}

.field-description {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin-top: 12px;
  padding: 12px;
  background: rgba(108, 117, 125, 0.08);
  border-radius: 8px;
  font-size: 13px;
  color: #6c757d;
  line-height: 1.4;
}

.description-icon {
  color: #6c757d;
  margin-top: 1px;
  flex-shrink: 0;
}

.boolean-field {
  border-left: 4px solid #28a745;
}

.custom-switch {
  margin-top: 8px;
}

.custom-switch :deep(.v-switch__track) {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;
  border: 1px solid rgba(0,0,0,0.1);
  opacity: 1 !important;
}

.custom-switch :deep(.v-switch__thumb) {
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  background: white !important;
}

.custom-switch :deep(.v-selection-control--dirty .v-switch__track) {
  background: linear-gradient(135deg, #a8e063 0%, #56ab2f 100%) !important;
  border-color: rgba(76, 175, 80, 0.4) !important;
}

.custom-switch :deep(.v-selection-control__input:not(.v-selection-control--dirty):hover .v-switch__track) {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
}

.custom-switch :deep(.v-selection-control--dirty .v-selection-control__input:hover .v-switch__track) {
  background: linear-gradient(135deg, #b9eda1 0%, #6bc640 100%) !important;
}

.custom-switch :deep(.v-switch--inset .v-selection-control__input) {
  border-radius: 16px;
}

.dropdown-field {
  border-left: 4px solid #17a2b8;
}

.custom-select :deep(.v-field) {
  background: rgba(255,255,255,0.8);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.custom-select :deep(.v-field:hover) {
  background: rgba(255,255,255,0.95);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.custom-select :deep(.v-field__input) {
  color: #2c3e50 !important;
}

.custom-select :deep(.v-select__selection) {
  color: #2c3e50 !important;
}

.custom-select :deep(.v-field--disabled) {
  opacity: 0.6;
}

.custom-select :deep(.v-field--disabled .v-field__input) {
  color: #6c757d !important;
}

.custom-select :deep(.v-list-item) {
  color: #2c3e50 !important;
}

.custom-select :deep(.v-list-item-title) {
  color: #2c3e50 !important;
}

.custom-select :deep(.v-list-item:hover) {
  background: rgba(102, 126, 234, 0.1) !important;
}

.custom-select :deep(.v-list-item--active) {
  background: rgba(102, 126, 234, 0.15) !important;
  color: #667eea !important;
}

.custom-select :deep(.v-list-item--active .v-list-item-title) {
  color: #667eea !important;
}

.custom-select :deep(.v-overlay__content) {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
}

.custom-select :deep(.v-list) {
  background: rgba(255,255,255,0.95) !important;
  backdrop-filter: blur(10px);
  border-radius: 12px;
}

/* String 필드 스타일 */
.string-field {
  border-left: 4px solid #6f42c1;
}

.custom-text-field :deep(.v-field),
.custom-textarea :deep(.v-field) {
  background: rgba(255,255,255,0.8);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.custom-text-field :deep(.v-field:hover),
.custom-textarea :deep(.v-field:hover) {
  background: rgba(255,255,255,0.95);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.custom-text-field :deep(.v-field__input),
.custom-textarea :deep(.v-field__input) {
  color: #2c3e50 !important;
}

.custom-text-field :deep(.v-field__input::placeholder),
.custom-textarea :deep(.v-field__input::placeholder) {
  color: #6c757d !important;
  opacity: 0.7;
}

.custom-text-field :deep(.v-label),
.custom-textarea :deep(.v-label) {
  color: #6c757d !important;
}

.custom-text-field :deep(.v-field--focused .v-label),
.custom-textarea :deep(.v-field--focused .v-label) {
  color: #667eea !important;
}

.custom-text-field :deep(.v-field--disabled),
.custom-textarea :deep(.v-field--disabled) {
  opacity: 0.6;
}

.custom-text-field :deep(.v-field--disabled .v-field__input),
.custom-textarea :deep(.v-field--disabled .v-field__input) {
  color: #6c757d !important;
}

.custom-textarea :deep(.v-field__input) {
  min-height: 80px;
}

.input-icon {
  color: #6c757d !important;
  margin-right: 8px;
}

.security-indicator {
  color: #ffc107 !important;
  animation: glow 2s ease-in-out infinite alternate;
}

/* Number 필드 스타일 */
.number-field {
  border-left: 4px solid #fd7e14;
}

.custom-number-field :deep(.v-field) {
  background: rgba(255,255,255,0.8);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.custom-number-field :deep(.v-field:hover) {
  background: rgba(255,255,255,0.95);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.custom-number-field :deep(.v-field__input) {
  color: #2c3e50 !important;
}

.custom-number-field :deep(.v-field__input::placeholder) {
  color: #6c757d !important;
  opacity: 0.7;
}

.custom-number-field :deep(.v-label) {
  color: #6c757d !important;
}

.custom-number-field :deep(.v-field--focused .v-label) {
  color: #667eea !important;
}

.custom-number-field :deep(.v-field--disabled) {
  opacity: 0.6;
}

.custom-number-field :deep(.v-field--disabled .v-field__input) {
  color: #6c757d !important;
}

.number-controls {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-left: 8px;
}

.number-btn {
  min-width: 20px !important;
  height: 20px !important;
  background: rgba(102, 126, 234, 0.1) !important;
  border-radius: 4px;
  transition: all 0.3s ease;
  color: #667eea !important;
}

.number-btn:hover {
  background: rgba(102, 126, 234, 0.2) !important;
  transform: scale(1.1);
  color: #764ba2 !important;
}

/* Unknown 필드 스타일 */
.unknown-field {
  border-left: 4px solid #dc3545;
}

.custom-alert {
  border-radius: 12px;
  border: 1px solid rgba(220, 53, 69, 0.2);
}

.alert-content p {
  font-size: 13px;
  opacity: 0.8;
}

/* 애니메이션 */
@keyframes glow {
  from {
    text-shadow: 0 0 5px rgba(255, 193, 7, 0.5);
  }
  to {
    text-shadow: 0 0 10px rgba(255, 193, 7, 0.8);
  }
}

/* 포커스 상태 개선 */
.config-field :deep(.v-field--focused) {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.config-field :deep(.v-field--focused .v-field__outline) {
  border-color: #667eea;
  border-width: 2px;
}

/* 반응형 디자인 */
@media (max-width: 600px) {
  .config-field {
    padding: 16px;
  }
  
  .field-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .field-label {
    font-size: 14px;
  }
  
  .number-controls {
    flex-direction: row;
    gap: 4px;
  }
}
</style> 