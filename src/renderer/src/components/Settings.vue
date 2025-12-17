<template>
  <div id="settings">
    <h2>水印设置</h2>
    <div>
      <label>水印内容：</label>
      <input v-model="state.content" />
    </div>
    <div>
      <label>水印方向：</label>
      <select v-model="state.direction">
        <option value="0">顺时针 45°</option>
        <option value="1">逆时针 45°</option>
      </select>
    </div>
    <div>
      <label>字体大小：</label>
      <input v-model="state.size" type="number" min="10" max="100" />
    </div>
    <div>
      <label>透明度：</label>
      <input
        v-model="state.opacity"
        type="range"
        min="0"
        max="1"
        step="0.1"
      />
    </div>
    <div>
      <label>水印字体：</label>
      <input v-model="state.font" />
    </div>
    <div>
      <label>全屏：</label>
      <input v-model="state.fullscreen" type="checkbox" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const state = reactive({
  content: '默认水印',
  direction: 0,
  size: 20,
  opacity: 0.5,
  font: 'Arial',
  fullscreen: true
});
</script>

<style>
#settings {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

#settings label {
  display: inline-block;
  width: 120px;
}

#settings input,
#settings select {
  margin-bottom: 10px;
}
</style>