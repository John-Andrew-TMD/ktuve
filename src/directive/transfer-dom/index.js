function getTarget(node) {
  if (!node || node === true) {
    return document.querySelector('#dialogHook')
  } else if (node === 'body') {
    return document.body
  } else {
    return document.querySelector(node)
  }
}

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    const target = getTarget(value)
    if (target) {
      target && target.appendChild(el)
    }
  }
}
