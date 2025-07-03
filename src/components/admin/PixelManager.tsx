import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Code, Facebook } from 'lucide-react';

interface PixelSettings {
  facebookPixelId: string;
  customHeadCode: string;
  isActive: boolean;
}

export function PixelManager() {
  const [settings, setSettings] = useState<PixelSettings>({
    facebookPixelId: '',
    customHeadCode: '',
    isActive: false
  });
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('pixel_settings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading pixel settings:', error);
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('pixel_settings', JSON.stringify(settings));
      
      // Apply settings immediately
      if (settings.isActive) {
        applyPixelSettings();
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving pixel settings:', error);
    }
  };

  const applyPixelSettings = () => {
    // Remove existing pixel/custom code
    const existingPixel = document.getElementById('fb-pixel');
    const existingCustom = document.getElementById('custom-head-code');
    
    if (existingPixel) existingPixel.remove();
    if (existingCustom) existingCustom.remove();

    if (!settings.isActive) return;

    // Add Facebook Pixel
    if (settings.facebookPixelId) {
      const pixelScript = document.createElement('script');
      pixelScript.id = 'fb-pixel';
      pixelScript.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${settings.facebookPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(pixelScript);

      // Add noscript fallback
      const noscript = document.createElement('noscript');
      noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${settings.facebookPixelId}&ev=PageView&noscript=1" />`;
      document.head.appendChild(noscript);
    }

    // Add custom head code
    if (settings.customHeadCode) {
      const customDiv = document.createElement('div');
      customDiv.id = 'custom-head-code';
      customDiv.innerHTML = settings.customHeadCode;
      document.head.appendChild(customDiv);
    }
  };

  const generatePreviewCode = () => {
    let code = '';
    
    if (settings.facebookPixelId) {
      code += `<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '${settings.facebookPixelId}');
  fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none" 
       src="https://www.facebook.com/tr?id=${settings.facebookPixelId}&ev=PageView&noscript=1" />
</noscript>
<!-- End Facebook Pixel Code -->

`;
    }

    if (settings.customHeadCode) {
      code += `<!-- Custom Head Code -->
${settings.customHeadCode}
<!-- End Custom Head Code -->`;
    }

    return code;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gerenciador de Pixels e Códigos</h2>
          <p className="text-gray-600">
            Configure o Facebook Pixel e códigos personalizados para o head da página
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Active Toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div>
              <h3 className="font-semibold text-blue-800">Status dos Códigos</h3>
              <p className="text-blue-700 text-sm">Ativar/desativar todos os códigos configurados</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isActive}
                onChange={(e) => setSettings(prev => ({ ...prev, isActive: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Facebook Pixel */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Facebook className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Facebook Pixel</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pixel ID do Facebook
              </label>
              <input
                type="text"
                value={settings.facebookPixelId}
                onChange={(e) => setSettings(prev => ({ ...prev, facebookPixelId: e.target.value }))}
                placeholder="Ex: 1234567890123456"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Encontre seu Pixel ID no Gerenciador de Eventos do Facebook
              </p>
            </div>
          </div>

          {/* Custom Head Code */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Código Personalizado no Head</h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                HTML/JavaScript Personalizado
              </label>
              <textarea
                value={settings.customHeadCode}
                onChange={(e) => setSettings(prev => ({ ...prev, customHeadCode: e.target.value }))}
                placeholder="Cole aqui qualquer código HTML, CSS ou JavaScript que deve ser inserido no <head>"
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Suporta: Google Analytics, GTM, outros pixels, CSS personalizado, etc.
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showPreview ? 'Ocultar' : 'Mostrar'} Preview do Código</span>
            </button>

            {showPreview && (
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-green-400 text-xs overflow-x-auto">
                  <code>{generatePreviewCode() || '<!-- Nenhum código configurado -->'}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {saved && (
                <span className="text-green-600 font-medium">✓ Configurações salvas com sucesso!</span>
              )}
            </div>
            
            <button
              onClick={saveSettings}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Configurações</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">📋 Instruções:</h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• O Facebook Pixel será disparado automaticamente em todas as páginas</li>
              <li>• O código personalizado será inserido no &lt;head&gt; da página</li>
              <li>• Use o toggle para ativar/desativar todos os códigos</li>
              <li>• As configurações são salvas localmente no navegador</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}