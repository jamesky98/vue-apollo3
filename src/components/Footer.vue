<template>
  <!-- Footer -->
  <footer style="height:2.5em;">
    <div class="d-flex">
      <!-- Copyright -->
      <div class="p-2 overflow-hidden flex-grow-1" style="background-color: rgba(0, 0, 0, 0.05); height: 2.5em;">
        狀態訊息：<span :style="{color: activeColor }" >{{ msg }}</span>
      </div>
      <!-- Copyright -->
      <div>
        <a href="https://sicl-nlsc.moi.gov.tw/" target="_blank">
          <img src="/sicl-fn.png" style="height:2.5em;" alt="logo">
        </a>
        <a href="https://siclm-nlsc.moi.gov.tw/USER/LogOn" target="_blank">
          <img src="/sicl-bk.png" style="height:2.5em;" alt="logo">
        </a>
      </div>
    </div>
  </footer>
  <!-- Footer -->
</template>
<script setup>
defineProps({
  msg: {type: String},
  activeColor: {type: String},
})
</script>
