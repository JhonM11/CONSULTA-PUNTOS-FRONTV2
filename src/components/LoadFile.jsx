import { useState, useRef } from "react"
import { useAuth } from "./AuthContext"
import { FiFilePlus, FiDownload, FiUpload, FiX, FiLock } from "react-icons/fi"
import { loadFilePuntos, downloadTemplateExcel } from "../services/loadfileService"
import Notification from "./Notification"
import "../styles/loadfile.css"

function LoadFile() {
  const { token } = useAuth()
  const fileInputRef = useRef(null)

  // Estados del componente
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false)
  const [notification, setNotification] = useState({ message: "", type: "" })
  const [fileLoaded, setFileLoaded] = useState(false)

  // Función para mostrar notificaciones
  const showNotification = (message, type) => {
    setNotification({ message, type })
  }

  // Función para cerrar notificaciones
  const closeNotification = () => {
    setNotification({ message: "", type: "" })
  }

  // Función para descargar plantilla
  const handleDownloadTemplate = async () => {
    setIsDownloadingTemplate(true)
    try {
      await downloadTemplateExcel()
      showNotification("Plantilla descargada exitosamente", "success")
    } catch (error) {
      console.error("Error al descargar plantilla:", error)
      showNotification("Error al descargar la plantilla", "error")
    } finally {
      setIsDownloadingTemplate(false)
    }
  }

  // Función para manejar la selección de archivo
  const handleFileSelect = (file) => {
    if (file) {
      // Validar tipo de archivo (Excel)
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ]

      if (!allowedTypes.includes(file.type)) {
        showNotification("Por favor selecciona un archivo Excel válido (.xlsx, .xls)", "warning")
        return
      }

      setSelectedFile(file)
      setUploadProgress(0)
      // Simular carga del archivo al frontend
      const loadToFrontend = () => {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 20 + 5
          if (progress >= 100) {
            progress = 100
            setFileLoaded(true)
            clearInterval(interval)
          }
          setUploadProgress(Math.min(progress, 100))
        }, 150)
      }
      loadToFrontend()
    }
  }

  // Función para manejar el click en el área de carga
  const handleFileAreaClick = () => {
    fileInputRef.current?.click()
  }

  // Función para manejar el cambio en el input de archivo
  const handleFileInputChange = (event) => {
    const file = event.target.files[0]
    handleFileSelect(file)
  }

  // Funciones para drag and drop
  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files[0]
    handleFileSelect(file)
  }

  // Función para remover archivo seleccionado
  const handleRemoveFile = () => {
    if (isUploading) return // No permitir remover si está cargando
    setSelectedFile(null)
    setUploadProgress(0)
    setFileLoaded(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Función para simular progreso de carga
  const simulateProgress = () => {
    return new Promise((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 15
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          resolve()
        }
        setUploadProgress(Math.min(progress, 100))
      }, 200)
    })
  }

  // Función para cargar archivo
  const handleUploadFile = async () => {
    if (!selectedFile) {
      showNotification("Por favor selecciona un archivo", "warning")
      return
    }

    setIsUploading(true)
    // Remover esta línea: setUploadProgress(0)

    try {
      // No simular progreso, usar el progreso actual del archivo ya cargado
      await loadFilePuntos(token, selectedFile)

      showNotification("Archivo cargado exitosamente", "success")

      // Limpiar después de carga exitosa
      setSelectedFile(null)
      setUploadProgress(0)
      setFileLoaded(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error al cargar archivo:", error)
      showNotification("Error al cargar el archivo", "error")
      // No reiniciar el progreso en caso de error
    } finally {
      setIsUploading(false)
    }
  }

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <>
      <div className="loadfile-container">
        {/* Header con título y botón de descarga */}
        <div className="loadfile-header">
          <div className="loadfile-title-content">
            <FiFilePlus className="loadfile-title-icon" />
            <h2>Cargar archivo puntos</h2>
          </div>
          <button className="loadfile-template-btn" onClick={handleDownloadTemplate} disabled={isDownloadingTemplate}>
            {isDownloadingTemplate ? (
              <>
                <div className="loadfile-template-spinner"></div>
                Descargando...
              </>
            ) : (
              <>
                Descargar Plantilla
                <FiDownload className="loadfile-template-icon" />
              </>
            )}
          </button>
        </div>

        {/* Área de carga de archivo */}
        <div
          className={`loadfile-drop-area ${isDragOver ? "drag-over" : ""} ${selectedFile ? "has-file" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileAreaClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileInputChange}
            className="loadfile-input-hidden"
          />

          {!selectedFile ? (
            <div className="loadfile-drop-content">
              <FiFilePlus className="loadfile-drop-icon" />
              <h3>Arrastra tu archivo aquí</h3>
              <p>o haz clic para seleccionar</p>
              <span className="loadfile-drop-hint">Archivos Excel (.xlsx, .xls)</span>
            </div>
          ) : (
            <div className="loadfile-selected-content">
              <div className="loadfile-file-info">
                <div className="loadfile-file-details">
                  <FiFilePlus className="loadfile-file-icon" />
                  <div className="loadfile-file-text">
                    <span className="loadfile-file-name">{selectedFile.name}</span>
                    <span className="loadfile-file-size">{formatFileSize(selectedFile.size)}</span>
                  </div>
                </div>
                <button
                  className="loadfile-remove-btn"
                  onClick={handleRemoveFile}
                  title={isUploading ? "Archivo en uso" : "Remover archivo"}
                  disabled={isUploading}
                >
                  {isUploading ? <FiLock /> : <FiX />}
                </button>
              </div>

              {/* Barra de progreso */}
              {(isUploading || uploadProgress > 0) && (
                <div className="loadfile-progress-container">
                  <div className="loadfile-progress-bar">
                    <div className="loadfile-progress-fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <span className="loadfile-progress-text">{Math.round(uploadProgress)}%</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botón de carga */}
        <div className="loadfile-upload-section">
          <button className="loadfile-upload-btn" onClick={handleUploadFile} disabled={!selectedFile || isUploading}>
            {isUploading ? (
              <>
                <div className="loadfile-upload-animation">
                  <div className="loadfile-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                Procesando archivo...
              </>
            ) : (
              <>
                <FiUpload />
                Cargar
              </>
            )}
          </button>
        </div>
      </div>

      {/* Componente de notificación */}
      <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
    </>
  )
}

export default LoadFile
