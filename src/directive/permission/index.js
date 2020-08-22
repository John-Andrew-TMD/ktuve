import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const newValue = value + ''
    const permissionIds = store.getters.permissionIds
    if (newValue.length && !permissionIds.includes(newValue)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
