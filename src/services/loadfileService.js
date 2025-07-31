import { PUNTOS_LOAD_FILE } from './env';

import { PUNTOS_DOWNLOAD_TEMPLATE } from './env';




export const loadFilePuntos = async (token, file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
  
      const response = await fetch(PUNTOS_LOAD_FILE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // No incluir 'Content-Type', el navegador la define automáticamente al usar FormData
        },
        body: formData,
      })
  
      if (!response.ok) {
        throw new Error('Error al cargar el archivo de puntos')
      }
  
      return await response.json()
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  




  export const downloadTemplateExcel = async () => {
    try {
      const response = await fetch(PUNTOS_DOWNLOAD_TEMPLATE, {
        method: 'GET',
      })
  
      if (!response.ok) {
        throw new Error('Error al descargar la plantilla Excel')
      }
  
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'plantilla_puntos.xlsx'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  