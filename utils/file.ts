
/** 获取文件的base64 Url
 * 
 * @param file 文件
 * @returns Promise<string>
 */
export const file2Url = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = (err) => {
      reject(err)
    }
    reader.onabort = (err) => {
      reject(err)
    }
    reader.readAsDataURL(file)
  })
}
