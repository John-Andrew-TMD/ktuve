module.exports = {
  title: '金证前海融资租赁管理平台',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  // errorLog: 'production'
  errorLog: ['production', 'development'],

  /**
   * @type {number}
   * @description 流程逾期多少天改变颜色
   */
  flowOverdueDays: 3,

  /**
   * @type {boolean}
   * @description 是否发送微信模板消息
   */
  sendTemplateMessage: false

}
