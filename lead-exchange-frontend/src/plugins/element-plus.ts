// Element Plus UI组件库配置
// 配置Element Plus的主题、国际化等

import type { App } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

/**
 * Element Plus配置选项
 */
interface ElementPlusOptions {
  locale?: any
  size?: 'large' | 'default' | 'small'
  zIndex?: number
  namespace?: string
}

/**
 * 获取当前语言的Element Plus语言包
 */
function getLocale(): any {
  const language = localStorage.getItem('language') || 'zh-cn'

  switch (language) {
    case 'en':
      return en
    case 'zh-cn':
    default:
      return zhCn
  }
}

/**
 * 安装和配置Element Plus
 * @param app Vue应用实例
 */
export function setupElementPlus(app: App): void {
  const options: ElementPlusOptions = {
    locale: getLocale(),
    size: 'default',
    zIndex: 3000,
    namespace: 'el',
  }

  // 安装Element Plus
  app.use(ElementPlus, options)

  // 设置全局配置
  app.config.globalProperties.$ELEMENT = options
}

/**
 * 动态切换Element Plus语言
 * @param language 语言代码
 */
export function switchElementPlusLocale(language: string): any {
  let locale

  switch (language) {
    case 'en':
      locale = en
      break
    case 'zh-cn':
    default:
      locale = zhCn
      break
  }

  // 保存到本地存储
  localStorage.setItem('language', language)

  return locale
}

/**
 * Element Plus主题配置
 */
export const elementPlusTheme = {
  /**
   * 切换到浅色主题
   */
  switchToLight(): void {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  },

  /**
   * 切换到深色主题
   */
  switchToDark(): void {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  },

  /**
   * 切换主题
   */
  toggle(): void {
    const isDark = document.documentElement.classList.contains('dark')
    if (isDark) {
      this.switchToLight()
    } else {
      this.switchToDark()
    }
  },

  /**
   * 初始化主题
   */
  init(): void {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.switchToDark()
    } else {
      this.switchToLight()
    }
  },

  /**
   * 获取当前主题
   */
  getCurrentTheme(): 'light' | 'dark' {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  },
}

/**
 * Element Plus自定义主题变量
 */
export const customThemeVars = {
  // 主色调
  '--el-color-primary': '#409eff',
  '--el-color-primary-light-1': '#53a8ff',
  '--el-color-primary-light-2': '#66b1ff',
  '--el-color-primary-light-3': '#79bbff',
  '--el-color-primary-light-4': '#8cc5ff',
  '--el-color-primary-light-5': '#a0cfff',
  '--el-color-primary-light-6': '#b3d8ff',
  '--el-color-primary-light-7': '#c6e2ff',
  '--el-color-primary-light-8': '#d9ecff',
  '--el-color-primary-light-9': '#ecf5ff',
  '--el-color-primary-dark-1': '#337ecc',
  '--el-color-primary-dark-2': '#2d70b3',

  // 成功色
  '--el-color-success': '#67c23a',
  '--el-color-success-light-1': '#85ce61',
  '--el-color-success-light-2': '#95d475',
  '--el-color-success-dark-1': '#5daf34',

  // 警告色
  '--el-color-warning': '#e6a23c',
  '--el-color-warning-light-1': '#ebb563',
  '--el-color-warning-light-2': '#f0c78a',
  '--el-color-warning-dark-1': '#cf9236',

  // 危险色
  '--el-color-danger': '#f56c6c',
  '--el-color-danger-light-1': '#f78989',
  '--el-color-danger-light-2': '#f9a7a7',
  '--el-color-danger-dark-1': '#dd6161',

  // 信息色
  '--el-color-info': '#909399',
  '--el-color-info-light-1': '#a6a9ad',
  '--el-color-info-light-2': '#b9bcc0',
  '--el-color-info-dark-1': '#82848a',
}

/**
 * 应用自定义主题变量
 */
export function applyCustomTheme(): void {
  const root = document.documentElement

  Object.entries(customThemeVars).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
}
