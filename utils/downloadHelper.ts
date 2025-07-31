/**
 * 下载文件到本地
 * @param url 文件URL
 * @param filename 文件名
 */
export const downloadFile = async (url: string, filename: string): Promise<void> => {
  try {
    // 创建一个临时的a标签来触发下载
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.target = '_blank'
    
    // 添加到DOM中
    document.body.appendChild(link)
    
    // 触发点击
    link.click()
    
    // 清理DOM
    document.body.removeChild(link)
  } catch (error) {
    console.error('下载失败:', error)
    throw new Error('下载失败，请重试')
  }
}

/**
 * 通过fetch下载文件
 * @param url 文件URL
 * @param filename 文件名
 */
export const downloadFileWithFetch = async (url: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 清理URL对象
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('下载失败:', error)
    throw new Error('下载失败，请重试')
  }
}

/**
 * 批量下载文件
 * @param files 文件数组，每个元素包含url和filename
 */
export const downloadMultipleFiles = async (files: Array<{url: string, filename: string}>): Promise<void> => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    try {
      await downloadFileWithFetch(file.url, file.filename)
      // 添加延迟避免浏览器阻止多个下载
      if (i < files.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error(`下载文件 ${file.filename} 失败:`, error)
    }
  }
}

/**
 * 获取文件扩展名
 * @param url 文件URL
 * @returns 文件扩展名
 */
export const getFileExtension = (url: string): string => {
  const urlParts = url.split('.')
  return urlParts[urlParts.length - 1] || 'jpg'
}

/**
 * 生成下载文件名
 * @param originalName 原始文件名
 * @param extension 文件扩展名
 * @returns 下载文件名
 */
export const generateDownloadFilename = (originalName: string, extension: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  return `${originalName}_${timestamp}.${extension}`
} 