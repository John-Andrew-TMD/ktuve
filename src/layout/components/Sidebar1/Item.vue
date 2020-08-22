<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    hasChildren: {
      type: Boolean,
      default: false
    },
    showMenu: {
      type: Boolean,
      default: false
    }
  },
  render(h, context) {
    const { icon, title, hasChildren, showMenu } = context.props
    const childNodes = []
    if (hasChildren) {
      childNodes.push(h('i', { class: {
        'el-icon-arrow-right': true,
        'arrow-down': showMenu
      }}))
    }
    if (icon) {
      const newIcon = 'iconfont icon-' + icon
      childNodes.push(h('i', { class: {
        [newIcon]: true
      }}))
    }
    if (title) {
      childNodes.push(h('span', title))
    }
    return h(
      'div',
      {
        class: {
          'menu-title': true
        },
        on: {
          click: function() {
            hasChildren && context.listeners['menu-click']()
          }
        }
      },
      childNodes
    )
  }
}
</script>
