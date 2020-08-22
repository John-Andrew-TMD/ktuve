<template>
  <div id="app">
    <transition name="fade">
      <router-view />
    </transition>
    <login-dialog v-if="loginDialogStatus"></login-dialog>
    <div class="modal-box" v-if="$store.state.app.modalBoxStatus"></div>
  </div>
</template>

<script>
import loginDialog from 'components/LoginPanel/loginDialog'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  computed: {
    ...mapGetters([
      'loginDialogStatus'
    ])
  },
  components: {
    loginDialog
  }
}
</script>
