<template>
  <!-- Footer -->
  <footer>
    <!-- Copyright -->
    <div class="p-2 overflow-hidden" style="background-color: rgba(0, 0, 0, 0.05); height: 5vh;">
      狀態訊息：{{ msg }}
    </div>
    <!-- Copyright -->
  </footer>
  <!-- Footer -->
</template>
<script setup>
defineProps({
  msg: {type: String}
})
</script>
