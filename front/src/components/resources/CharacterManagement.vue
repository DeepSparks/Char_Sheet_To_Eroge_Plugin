<template>
  <div class="management-section">
    <div class="section-header">
      <h2 class="section-title">캐릭터 관리</h2>
    </div>
    
    <div v-if="characters.length === 0" class="empty-state">
      <v-icon class="empty-icon" size="120">mdi-account-group</v-icon>
      <h3 class="empty-title">생성된 캐릭터가 없습니다</h3>
    </div>

    <v-data-table
      v-else
      :headers="characterHeaders"
      :items="characters"
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
  characters: {
    type: Array,
    default: () => []
  }
})

// 테이블 헤더 정의
const characterHeaders = computed(() => [
  { title: '이름', key: 'name', width: '100px' },
  { title: '성별', key: 'gender', width: '100px' },
  { title: '나이', key: 'age' },
  { title: '헤어 스타일', key: 'hair_style' },
  { title: '헤어 색상', key: 'hair_color' },
  { title: '눈 색상', key: 'eye_color' },
  { title: '가슴 크기', key: 'breast_size' },
  { title: '피부 색상', key: 'skin_color' },
  { title: '음성 타입', key: 'voice_type', width: '125px' },
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
