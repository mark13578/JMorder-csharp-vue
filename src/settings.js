export default {
  /**
   * 框架版本号
   */
  version: '20241218',
  /**
   * 网页标题
   */
  title: import.meta.env.VITE_APP_TITLE,
  /**
   * 侧边栏主题 深色主题theme-dark，浅色主题theme-light
   */
  sideTheme: 'theme-dark',
  /**
   * 框架主题颜色值
   */
  theme: '#409EFF',
  /**
   * 是否系统布局配置
   */
  showSettings: true,

  /**
   * 是否显示顶部导航
   */
  topNav: false,

  /**
   * 是否显示 tagsView
   */
  tagsView: true,

  /**
   * 是否固定头部
   */
  fixedHeader: true,

  /**
   * 是否显示logo
   */
  sidebarLogo: false,

  /**
   * 是否显示动态标题
   */
  dynamicTitle: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production',
  /**
   * 版权信息
   */
  copyright: 'Copyright ©2024 <a target="_black" href="">捷名印刷有限公司</a> All Rights Reserved.',
  /**
   * 是否显示底部栏
   */
  showFooter: true,
  /**
   * 是否显示水印
   */
  showWatermark: false,
  /**
   * 水印文案
   */
  watermarkText: '捷名印刷',
  /**
   * 是否显示其他登录
   */
  showOtherLogin: false,
  /**
   * 默认大小
   */
  defaultSize: 'default',
  /**
   * 默认语言
   */
  defaultLang: 'zh-TW',
  /**
   * 左侧菜单是否显示New标记
   */
  menuShowNew: false,
  /**
   * 是否显示QR登录
   */
  showQrLogin: false,
  /**
   * 是否显示手机号登录
   */
  showPhoneLogin: false,
  /**
   * 标签页持久化
   */
  tagsViewPersist: false,
  /**
   * 标签显示icon
   */
  tagsShowIcon: true,
  /**
   * 导航模式 1、侧边栏 2、混合 3、纯顶部
   */
  navType: 1,
  /**
   * 前往通知地址
   */
  noticeUrl: '/system/notice',
}
