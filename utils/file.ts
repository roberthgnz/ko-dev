export const getFileType = (file: File) => {
  const { type } = file
  const fileType = type.split("/")[0]
  return fileType
}

export const getMimeType = (file: File) => {
  const { type } = file
  return type
}
