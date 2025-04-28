const { getGPTResponse } = require('./api')
const {
  getLocaleFilePath,
  getFolderPath,
  writeJsonFileSync,
  readJsonFileSync,
  setNestedProperty,
  hasNestedProperty,
  locales,
} = require('./util')

let translationsCache = {}

async function syncLocale(project) {
  const folderPath = getFolderPath(project)
  await compareAndUpdateLocales(folderPath)
  return true
}

async function compareAndUpdateLocales(folderPath) {
  const baseLocalePath = getLocaleFilePath(folderPath, 'en')
  const baseLocaleContent = readJsonFileSync(baseLocalePath)

  const localeContents = {}
  for (const locale of locales) {
    const localePath = getLocaleFilePath(folderPath, locale)
    localeContents[locale] = readJsonFileSync(localePath)
  }

  await updateLocaleFilesWithBaseKeys(folderPath, baseLocaleContent, localeContents, locales)
}

async function updateLocaleFilesWithBaseKeys(
  folderPath,
  baseLocaleContent,
  localeContents,
  locales,
  currentPath = '',
) {
  for (const key in baseLocaleContent) {
    const newPath = currentPath ? `${currentPath}.${key}` : key

    if (typeof baseLocaleContent[key] === 'object' && baseLocaleContent[key] !== null) {
      // 중첩 객체 처리
      for (const locale of locales) {
        if (!hasNestedProperty(localeContents[locale], newPath)) {
          localeContents[locale][key] = {}
        }
      }
      await updateLocaleFilesWithBaseKeys(
        folderPath,
        baseLocaleContent[key],
        localeContents,
        locales,
        newPath,
      )
    } else {
      // 번역 필요한 경우 처리
      const needsTranslation = locales.some(
        (locale) => !hasNestedProperty(localeContents[locale], newPath),
      )

      if (needsTranslation) {
        if (!translationsCache[newPath]) {
          const translatedTexts = await getGPTResponseAndCaching(baseLocaleContent[key])
          translationsCache[newPath] = translatedTexts
        }

        for (const locale of locales) {
          if (!hasNestedProperty(localeContents[locale], newPath)) {
            setNestedProperty(
              localeContents[locale],
              newPath,
              translationsCache[newPath][locale] || baseLocaleContent[key],
            )
          }
        }

        // 각 번역이 완료될 때마다 모든 파일에 쓰기
        for (const locale of locales) {
          const localePath = getLocaleFilePath(folderPath, locale)
          writeJsonFileSync(localePath, localeContents[locale])
        }
      }
    }
  }
}

async function getGPTResponseAndCaching(text) {
  if (translationsCache[text]) {
    return translationsCache[text]
  }

  const translations = await getGPTResponse(text)
  translationsCache[text] = translations // 캐시 업데이트
  return translations
}

module.exports = {
  syncLocale,
}
