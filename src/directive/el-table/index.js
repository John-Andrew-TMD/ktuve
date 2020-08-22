// import { addResizeListener, removeResizeListener } from 'element-ui/src/utils/resize-event'

/**
 * How to use
 * <el-table height="100px" v-el-height-adaptive-table="{bottomOffset: 30}">...</el-table>
 * el-table height is must be set
 * bottomOffset: 30(default)   // The height of the table from the bottom of the page.
 */
let updateTimer = null
let headWrapper = null
let bodyWrapper = null
let scrollbarWidth = 0

function getScrollbarWidth() {
  const odiv = document.createElement('div')
  const styles = {
    width: '100px',
    height: '100px',
    overflowY: 'scroll'
  }
  for (const i in styles) odiv.style[i] = styles[i]
  document.body.appendChild(odiv)
  const scrollbarWidth = odiv.offsetWidth - odiv.clientWidth
  odiv.remove()
  return scrollbarWidth
}


const setHeight = (el, binding, vnode) => {
  // debugger
  const { value } = binding
  // if (!$table.height) {
  //   throw new Error(`el-$table must set the height. Such as height='100px'`)
  // }
  const bottomOffset = (value && value.bottomOffset) || 0

  if (!el || !bottomOffset) return
  if (el.offsetHeight === 0) return
  // console.log(el.getBoundingClientRect().top)
  // console.log(window.innerHeight - el.getBoundingClientRect().top - 40 - bottomOffset)
  const calcHeight = el.getBoundingClientRect().top + headWrapper.offsetHeight + bottomOffset + 4
  
  bodyWrapper.style.maxHeight = `calc(100vh - ${calcHeight}px)`
  const bodyWrapperHeight = bodyWrapper.querySelector('table').offsetHeight
  if (bodyWrapperHeight !== 0) {
    if (!bodyWrapper.classList.contains('is-scrolling-none')) {
      bodyWrapper.style.height = bodyWrapperHeight + scrollbarWidth + 0.5 + 'px'
    } else {
      if (window.devicePixelRatio > 1) {
        bodyWrapper.style.height = bodyWrapperHeight + 0.5 + 'px'
      } else {
        bodyWrapper.style.height = 'auto'
      }
    }
  } else {
    bodyWrapper.style.height = 'auto'
  }
  const offsetWidth = bodyWrapper.offsetWidth
  const clientWidth = bodyWrapper.clientWidth
  if (offsetWidth === clientWidth) return
  try {
    const gutterDom = el.querySelector('.gutter')
    if (!gutterDom) return
    gutterDom.style.width = offsetWidth - clientWidth + 'px'
    const tableHeader = el.querySelector('.el-table__header')
    tableHeader.style.width = tableHeader.querySelector('thead').clientWidth + 'px'
  } catch (e) {
    console.log(e)
  }
}

const validateOffset = binding => {
  const { value } = binding
  const bottomOffset = (value && value.bottomOffset) || 0
  return !!bottomOffset
}

export default {
  // bind(el, binding, vnode) {
  //   if (!validateOffset(binding)) return
  //   bodyWrapper = el.querySelector('.el-table__body-wrapper')
  //   bodyWrapper.style.overflowY = 'auto'
  //   el.resizeListener = () => {
  //     clearTimeout(updateTimer)
  //     updateTimer = setTimeout(() => {
  //       setHeight(el, binding, vnode)
  //     }, 100)
  //   }
  //   window.addEventListener('resize', el.resizeListener)
  // },
  inserted(el, binding, vnode) {
    if (!validateOffset(binding)) return
    bodyWrapper = el.querySelector('.el-table__body-wrapper')
    headWrapper = el.querySelector('.el-table__header-wrapper')
    bodyWrapper.style.overflowY = 'auto'
    scrollbarWidth = getScrollbarWidth()
    setHeight(el, binding, vnode)
    el.resizeListener = () => {
      clearTimeout(updateTimer)
      updateTimer = setTimeout(() => {
        setHeight(el, binding, vnode)
      }, 50)
    }
    window.addEventListener('resize', el.resizeListener)
  },
  componentUpdated(el, binding, vnode) {
    if (!validateOffset(binding) || !bodyWrapper) return
    clearTimeout(updateTimer)
    updateTimer = setTimeout(() => {
      setHeight(el, binding, vnode)
    }, 100)
  },
  unbind(el, binding) {
    if (!validateOffset(binding)) return
    clearTimeout(updateTimer)
    window.removeEventListener('resize', el.resizeListener)
    el.resizeListener = null
    bodyWrapper = null
    headWrapper = null
    updateTimer = null
    scrollbarWidth = null
  }
}
