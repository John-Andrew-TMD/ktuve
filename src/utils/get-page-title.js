import defaultSettings from '@/settings'

const title = defaultSettings.title || '融资租赁管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
