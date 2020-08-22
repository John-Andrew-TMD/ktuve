<template>
 <div class="data">
    <span v-if="digit === '-'" class="data-num">-</span>
    <count-to v-else :start-val="0" :end-val="digit" :duration="2000" class="data-num"></count-to>
    <span>{{title}}</span>
 </div>
</template>

<script>
import CountTo from 'vue-count-to'
 export default {
   props: {
     num: {
       type: [String, Number]
     },
     title: {
       type: String,
       default: ''
     }
   },
   computed: {
     digit() {
       return this.num === '-' ? '-' : Number(this.num) || 0
     }
   },
   components: {
     CountTo
   }
 }
</script>
