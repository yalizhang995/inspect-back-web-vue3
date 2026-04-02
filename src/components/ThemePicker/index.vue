<template>
  <el-color-picker
    v-model="theme"
    :predefine="['#409EFF', '#1890ff', '#304156', '#212121', '#11a983', '#13c2c2', '#6959CD', '#f5222d']"
    class="theme-picker"
    popper-class="theme-picker-dropdown"
  />
</template>

<script>
const ORIGINAL_THEME = '#409EFF'

export default {
  data() {
    return {
      theme: ''
    }
  },
  computed: {
    defaultTheme() {
      return this.$store.state.settings.theme
    }
  },
  watch: {
    defaultTheme: {
      handler(val) {
        this.theme = val
      },
      immediate: true
    },
    theme(val) {
      this.applyTheme(val)
    }
  },
  created() {
    this.applyTheme(this.defaultTheme || ORIGINAL_THEME)
  },
  methods: {
    applyTheme(val) {
      if (typeof val !== 'string' || !val) return
      document.documentElement.style.setProperty('--el-color-primary', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style>
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}

.theme-picker .el-color-picker__trigger {
  height: 26px !important;
  width: 26px !important;
  padding: 2px;
}

.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
</style>
