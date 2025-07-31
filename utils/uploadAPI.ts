// 模拟图片上传API
export interface UploadResponse {
  success: boolean
  url: string
  filename: string
  size: number
  message?: string
}

/**
 * 模拟图片上传到服务器
 * @param file 要上传的文件
 * @returns Promise<UploadResponse>
 */
export const uploadImage = async (file: File): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      try {
        // 模拟上传成功
        const filename = `uploaded_${Date.now()}_${file.name}`
        const url = `https://picsum.photos/512/512?random=${Date.now()}`
        
        resolve({
          success: true,
          url,
          filename,
          size: file.size
        })
      } catch (error) {
        reject({
          success: false,
          url: '',
          filename: '',
          size: 0,
          message: '上传失败'
        })
      }
    }, 1000) // 模拟1秒上传时间
  })
}

/**
 * 模拟批量上传图片
 * @param files 要上传的文件数组
 * @returns Promise<UploadResponse[]>
 */
export const uploadImages = async (files: File[]): Promise<UploadResponse[]> => {
  const uploadPromises = files.map(file => uploadImage(file))
  return Promise.all(uploadPromises)
}

/**
 * 验证文件类型
 * @param file 文件对象
 * @returns boolean
 */
export const validateImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  const maxSize = 10 * 1024 * 1024 // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('不支持的文件类型，请上传 JPG、PNG 或 WebP 格式的图片')
  }
  
  if (file.size > maxSize) {
    throw new Error('文件大小不能超过 10MB')
  }
  
  return true
}

/**
 * 创建文件预览URL
 * @param file 文件对象
 * @returns string
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file)
}

/**
 * 清理文件预览URL
 * @param url 预览URL
 */
export const revokeFilePreview = (url: string): void => {
  URL.revokeObjectURL(url)
} 