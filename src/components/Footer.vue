<template>
  <!-- Footer -->
  <footer style="height:2.5em;">
    <!-- Copyright -->
    <div class="p-2 overflow-hidden" style="background-color: rgba(0, 0, 0, 0.05); height: 2.5em;">
      狀態訊息：<span :style="{color: activeColor }" >{{ msg }}</span>
    </div>
    <!-- Copyright -->
  </footer>
  <!-- Footer -->
</template>
<script setup>
defineProps({
  msg: {type: String},
  activeColor: {type: String},
})
</script>
