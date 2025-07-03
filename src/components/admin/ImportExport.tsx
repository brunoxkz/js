import React, { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface ImportExportProps {
  onExport: () => boolean;
  onImport: (file: File) => Promise<boolean>;
  onRestore: () => boolean;
}

export function ImportExport({ onExport, onImport, onRestore }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    try {
      const success = onExport();
      if (success) {
        setMessage({ type: 'success', text: 'Preguntas exportadas exitosamente' });
      } else {
        setMessage({ type: 'error', text: 'Error al exportar las preguntas' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error inesperado al exportar' });
    }
    
    setTimeout(() => setMessage(null), 5000);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setMessage({ type: 'error', text: 'Por favor selecciona un archivo JSON válido' });
      setTimeout(() => setMessage(null), 5000);
      return;
    }

    setImporting(true);
    try {
      const success = await onImport(file);
      if (success) {
        setMessage({ type: 'success', text: 'Preguntas importadas exitosamente' });
      } else {
        setMessage({ type: 'error', text: 'Error al importar: formato de archivo inválido' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error inesperado al importar el archivo' });
    } finally {
      setImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }

    setTimeout(() => setMessage(null), 5000);
  };

  const handleRestore = () => {
    if (window.confirm('¿Estás seguro de que quieres restaurar el backup? Esto sobrescribirá las preguntas actuales.')) {
      try {
        const success = onRestore();
        if (success) {
          setMessage({ type: 'success', text: 'Backup restaurado exitosamente' });
        } else {
          setMessage({ type: 'error', text: 'No hay backup disponible para restaurar' });
        }
      } catch (error) {
        setMessage({ type: 'error', text: 'Error inesperado al restaurar el backup' });
      }
      
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Import & Export</h2>
          <p className="text-gray-600">
            Gestiona tus preguntas exportándolas como backup o importando desde archivos externos
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-6 mt-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center space-x-2">
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span>{message.text}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Export */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Exportar Preguntas</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Descarga todas tus preguntas en formato JSON como backup
                </p>
                <button
                  onClick={handleExport}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Descargar JSON
                </button>
              </div>
            </div>

            {/* Import */}
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-900 mb-2">Importar Preguntas</h3>
                <p className="text-green-700 text-sm mb-4">
                  Carga preguntas desde un archivo JSON externo
                </p>
                <button
                  onClick={handleImportClick}
                  disabled={importing}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  {importing ? 'Importando...' : 'Seleccionar Archivo'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Restore */}
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Restaurar Backup</h3>
                <p className="text-yellow-700 text-sm mb-4">
                  Restaura la versión anterior de tus preguntas
                </p>
                <button
                  onClick={handleRestore}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Restaurar Backup
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-start space-x-3">
              <FileText className="w-6 h-6 text-gray-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Instrucciones de Uso</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>
                    <strong>Exportar:</strong> Descarga un archivo JSON con todas tus preguntas actuales. 
                    Úsalo como backup o para transferir preguntas entre diferentes instalaciones.
                  </div>
                  <div>
                    <strong>Importar:</strong> Carga preguntas desde un archivo JSON. 
                    Esto reemplazará completamente todas las preguntas actuales.
                  </div>
                  <div>
                    <strong>Restaurar:</strong> Vuelve a la versión anterior de tus preguntas. 
                    Se crea un backup automático cada vez que guardas cambios.
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <strong>Importante:</strong> Siempre haz un backup antes de importar nuevas preguntas. 
                      La importación sobrescribirá todas las preguntas existentes.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}