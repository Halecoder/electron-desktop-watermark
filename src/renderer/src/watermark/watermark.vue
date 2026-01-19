<template>
  <div id="watermark-app">
    <div id="watermark-container" :style="containerStyle">
      <template v-for="item in watermarks" :key="item.key">
        <div class="watermark" :style="getWatermarkStyle(item)">
          {{ fullContent }}
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CSSProperties } from 'vue'

declare global {
  interface Window { watermarkConfig: any }
}

const config = window.watermarkConfig

const dateFormatMap: Record<string, (d: Date) => string> = {
  'YYYY-MMM-DD': d => `${d.getFullYear()}-${d.toLocaleString('en', { month:'short' }).toUpperCase()}-${String(d.getDate()).padStart(2, '0')}`,
  'YYYY-MM-DD': d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const fullContent = computed(() => {
  if (!config.withDate) return config.content
  const d = new Date()
  const fmtFn = dateFormatMap[config.dateFormat] || dateFormatMap['YYYY-MMM-DD']
  return `${config.content} ${fmtFn(d)}`
})

const containerStyle = computed<CSSProperties>(() => ({
  position: 'fixed',
  zIndex: '999999',
  width: '100vw',
  height: '100vh',
  top: '0',
  left: '0',
  overflow: 'hidden',
  pointerEvents: 'none'
}))


function getWatermarkStyle(item: { left: number; top: number; key: string }): CSSProperties {
  return {
    position: 'absolute',
    left: item.left + 'px',
    top: item.top + 'px',
    color: `rgba(0,0,0,${config.opacity})`,
    fontSize: `${config.size}px`,
    fontWeight: config.bold ? 'bold' : 'normal',
    fontFamily: config.font,
    transform: `rotate(${config.angle}deg) scaleX(${config.scaleX}) scaleY(${config.scaleY})`,
    userSelect: 'none',
    whiteSpace: 'nowrap',
    pointerEvents: 'none'
  }
}

interface WatermarkItem {
  key: string
  left: number
  top: number
}

const watermarks = computed<WatermarkItem[]>(() => {
  const items: WatermarkItem[] = []
  const width = window.innerWidth
  const height = window.innerHeight

  const hCount = Math.ceil(width / config.horizontalSpacing) + 1
  const vCount = Math.ceil(height / config.verticalSpacing) + 1

  for (let y = 0; y < vCount; y++) {
    for (let x = 0; x < hCount; x++) {
      items.push({
        key: `${x}-${y}`,
        left: x * config.horizontalSpacing,
        top: y * config.verticalSpacing
      })
    }
  }

  return items
})
</script>

<style scoped>
#watermark-container {
  pointer-events: none;
}
.watermark {
  opacity: 1;
  font-weight: 500;
}
html, body {
  background: transparent !important;
}
</style>
