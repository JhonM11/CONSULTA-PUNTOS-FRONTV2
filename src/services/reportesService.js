import { PUNTOS_REPORTS_FORMAT_EXCEL } from './env';

import { PUNTOS_REPORTS_FORMAT_ANSIBLE } from './env';



export const getReportExcel = async (token, { tipoConexionCode = '', zonaCode = '', centroCostoCode = '' } = {}) => {
    try {
      // Construcción de parámetros dinámicos
      const params = new URLSearchParams()
      if (tipoConexionCode) params.append('tipoConexionCode', tipoConexionCode)
      if (zonaCode) params.append('zonaCode', zonaCode)
      if (centroCostoCode) params.append('centroCostoCode', centroCostoCode)
  
      const url = `${PUNTOS_REPORTS_FORMAT_EXCEL}?${params.toString()}`
  
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  
      if (!response.ok) {
        throw new Error('Error al generar o descargar el reporte en Excel')
      }
  
      // Obtener blob y crear descarga
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = 'reporte.xlsx'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
  
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  