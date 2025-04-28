const {
  getFolderPath,
  locales,
  getLocaleFilePath,
  readJsonFileSync,
  writeJsonFileSync,
} = require('./util')

async function deleteKey(project, key) {
  console.log('🚀 ~ deleteKey ~ project, key:', project, key)
  const folderPath = getFolderPath(project)
  const localeContents = {}
  for (const locale of locales) {
    const localePath = getLocaleFilePath(folderPath, locale)
    localeContents[locale] = readJsonFileSync(localePath)
  }

  deleteKeyFromLocale(localeContents, key)

  for (const locale of locales) {
    const localePath = getLocaleFilePath(folderPath, locale)
    writeJsonFileSync(localePath, localeContents[locale])
  }
  return true
}

function deleteKeyFromLocale(localeContents, key) {
  const parts = key.split('.')
  for (const locale in localeContents) {
    let current = localeContents[locale]
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) return
      current = current[parts[i]]
    }
    delete current[parts[parts.length - 1]]
  }
}

module.exports = {
  deleteKey,
}
