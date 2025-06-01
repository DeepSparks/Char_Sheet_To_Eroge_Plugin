<template>
  <div class="management-section">
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
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  selectedResourceName: {
    type: String,
    required: true
  },
  backgrounds: {
    type: Array,
    default: () => []
  }
})

// 테이블 헤더 정의
const backgroundHeaders = computed(() => [
  { title: '배경 ID', key: 'background_id' },
  { title: '설정 타입', key: 'setting_type' },
  { title: '위치', key: 'location' },
  { title: '시간대', key: 'time_period' },
  { title: '계절', key: 'season' },
  { title: '날씨', key: 'weather' },
  { title: '특별 기능', key: 'special_features' },
  { title: '기타', key: 'etc' }
])
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

.data-table {
  background: rgba(255,255,255,0.8) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.4) !important;
  border-radius: 16px !important;
  overflow: hidden;
  color: black;
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
