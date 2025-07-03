import React from 'react';
import { AlertTriangle, TrendingUp, Shield, ArrowRight, Clock, Zap } from 'lucide-react';
import { getDiagnosisContent } from '../../utils/divineCode';
import { DiagnosisType } from '../../types';
import { PotentialMeter } from '../ui/PotentialMeter';
import { HiddenArchitectureEngine } from '../../utils/hiddenArchitecture';

interface DiagnosisStepProps {
  divineCode: string;
  diagnosis: DiagnosisType;
  onNext: () => void;
}

export function DiagnosisStep({ divineCode, diagnosis, onNext }: DiagnosisStepProps) {
  // Generate personalized content using Hidden Architecture
  const psychProfile = {
    urgencyLevel: 75, // This would come from actual user behavior analysis
    dominantPain: 'prayer-ceiling',
    emotionalTriggers: ['shame_relief', 'provider_identity']
  };

  const content = HiddenArchitectureEngine.generateDiagnosisContent(
    diagnosis, 
    divineCode, 
    psychProfile
  );
  
  // Calculate current percentage based on diagnosis
  const getCurrentPercentage = () => {
    switch (diagnosis) {
      case 'financial-ceiling': return 37;
      case 'purpose-misalignment': return 32;
      case 'generational-curse': return 28;
      case 'divine-timing': return 41;
      case 'spiritual-blockage': return 25;
      default: return 35;
    }
  };

  const getDiagnosisIcon = () => {
    switch (diagnosis) {
      case 'financial-ceiling': return '🚧';
      case 'purpose-misalignment': return '🧭';
      case 'generational-curse': return '⛓️';
      case 'divine-timing': return '⏰';
      case 'spiritual-blockage': return '🔒';
      default: return '⚠️';
    }
  };

  const getUrgencyColor = () => {
    if (psychProfile.urgencyLevel > 80) return 'from-red-500 to-orange-500';
    if (psychProfile.urgencyLevel > 60) return 'from-orange-500 to-yellow-500';
    return 'from-yellow-500 to-green-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center px-4 pb-24">
      <div className="max-w-5xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-red-200">
          {/* Header with Divine Analysis */}
          <div className="text-center mb-6 md:mb-8">
            <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-6">
              {/* Pulsing divine aura */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse opacity-40"></div>
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-2xl md:text-3xl">{getDiagnosisIcon()}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-bold mb-4">
                🔍 DIAGNÓSTICO DIVINO COMPLETO
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              ANÁLISIS FINALIZADO
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-red-600 mb-4">
              {content.title}
            </h2>
            
            {/* Urgency Indicator */}
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${getUrgencyColor()} text-white font-bold text-sm mb-4`}>
              <Clock className="w-4 h-4" />
              <span>NIVEL DE URGENCIA: {psychProfile.urgencyLevel}%</span>
              <Zap className="w-4 h-4" />
            </div>
          </div>

          {/* Potential Meter - SEM SUBTÍTULO */}
          <div className="mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-purple-800 mb-2">
                  ANÁLISIS DE TU POTENCIAL DIVINO
                </h3>
              </div>

              <div className="space-y-6">
                {/* Potencial Divino */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">Tu Potencial Divino</span>
                    <span className="text-2xl font-bold text-yellow-600">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 h-4 rounded-full shadow-lg relative overflow-hidden"
                      style={{ width: '95%' }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    ✨ Capacidad máxima que Dios colocó en ti
                  </p>
                </div>

                {/* Realidad Actual */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-800">Tu Realidad Financiera Actual</span>
                    <span className="text-2xl font-bold text-red-600">{getCurrentPercentage()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-red-500 h-4 rounded-full shadow-lg"
                      style={{ width: `${getCurrentPercentage()}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-red-700 mt-1">
                    ⚠️ Nivel actual de manifestación de tu potencial
                  </p>
                </div>

                {/* Gap Analysis */}
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="text-center">
                    <div className="text-3xl font-black text-purple-800 mb-2">
                      {95 - getCurrentPercentage()}%
                    </div>
                    <p className="text-purple-700 font-semibold text-sm">
                      DE TU POTENCIAL DIVINO ESTÁ BLOQUEADO
                    </p>
                    <p className="text-purple-600 text-xs mt-1">
                      Este es el "Techo Invisible" que debemos romper
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Description */}
          <div className="bg-red-50 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border-2 border-red-200">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-red-800 mb-2">
                  Tu Código {divineCode} Revela:
                </h3>
                <p className="text-gray-800 text-base md:text-lg leading-relaxed">
                  {content.description}
                </p>
              </div>
            </div>

            {/* Urgent Message */}
            <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-xl p-4 border-l-4 border-red-500">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-800 mb-1">⚠️ MENSAJE URGENTE:</h4>
                  <p className="text-red-700 text-sm md:text-base">
                    {content.urgentMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-xl p-4 md:p-6 border border-red-200 text-center">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-red-600" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-red-600 mb-2">
                {content.percentage}
              </div>
              <p className="text-red-700 text-sm font-medium">
                de cristianos con tu código específico sufren esto
              </p>
            </div>

            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 md:p-6 border border-yellow-200 text-center">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-orange-700 text-sm font-medium">Potencial:</span>
                  <span className="font-bold text-orange-800">{content.potential}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-700 text-sm font-medium">Realidad:</span>
                  <span className="font-bold text-red-600">{content.current}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 md:p-6 border border-purple-200 text-center">
              <div className="flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
              <div className="text-lg md:text-xl font-black text-purple-600 mb-2">
                {95 - getCurrentPercentage()}%
              </div>
              <p className="text-purple-700 text-sm font-medium">
                de tu potencial divino está BLOQUEADO
              </p>
            </div>
          </div>

          {/* Characteristics */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 text-center">
              🔍 Este patrón se manifiesta específicamente como:
            </h3>
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              {content.characteristics.map((characteristic, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 text-sm md:text-base leading-relaxed">{characteristic}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Transition */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border-2 border-green-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🙏</span>
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-4">
                ✨ PERO HAY UNA REVELACIÓN PODEROSA...
              </h3>
              
              <p className="text-green-700 text-lg md:text-xl mb-4 leading-relaxed">
                Tu Código Divino <span className="font-bold text-green-800 text-xl md:text-2xl">{divineCode}</span> contiene la{' '}
                <span className="font-bold bg-green-200 px-2 py-1 rounded">CLAVE DE ACTIVACIÓN EXACTA</span> para romper este patrón en los próximos{' '}
                <span className="font-bold text-green-800 text-xl md:text-2xl">7 días</span>.
              </p>
              
              <div className="bg-white rounded-xl p-4 mb-4 border border-green-300">
                <p className="text-green-700 text-base md:text-lg font-medium">
                  🎯 Hemos desarrollado un <span className="font-bold">Plan Divino de Activación de 7 Días</span> específicamente 
                  para personas con tu Código {divineCode} y este patrón exacto de bloqueo.
                </p>
              </div>

              <div className="text-sm text-green-600 font-medium">
                ⏰ Este plan ha funcionado para el 94% de las personas con tu mismo código y diagnóstico
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={onNext}
              className="group w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg md:text-xl font-bold py-5 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 mb-4"
            >
              <span className="flex items-center justify-center space-x-3">
                <span>🔓 RECIBIR MI PLAN DE ACTIVACIÓN DE 7 DÍAS</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <p className="text-center text-gray-600 text-sm">
              Plan personalizado basado en tu Código {divineCode} y patrón específico de {content.title.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Floating CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-green-200 p-4 shadow-lg z-50">
        <div className="max-w-md mx-auto">
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center justify-center space-x-2">
              <span className="text-lg">🔓 VER MI PLAN AHORA</span>
              <ArrowRight className="w-5 h-5" />
            </span>
          </button>
          
          <p className="text-center text-xs text-gray-500 mt-2">
            💎 Específico para código {divineCode} • ⏰ Resultados en 7 días
          </p>
        </div>
      </div>
    </div>
  );
}