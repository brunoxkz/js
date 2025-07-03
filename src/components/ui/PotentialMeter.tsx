import React from 'react';
import { Crown, TrendingUp } from 'lucide-react';

interface PotentialMeterProps {
  divinePercentage: number;
  currentPercentage: number;
}

export function PotentialMeter({ divinePercentage, currentPercentage }: PotentialMeterProps) {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200">
      <div className="text-center mb-6">
        <Crown className="w-12 h-12 text-purple-600 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-purple-800 mb-2">
          ANÁLISIS DE TU POTENCIAL DIVINO
        </h3>
        <p className="text-purple-600 text-sm">
          Comparación entre tu capacidad divina y tu realidad actual
        </p>
      </div>

      <div className="space-y-6">
        {/* Potencial Divino */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-gray-800">Tu Potencial Divino</span>
            </div>
            <span className="text-2xl font-bold text-yellow-600">{divinePercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
            <div 
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 h-4 rounded-full shadow-lg relative overflow-hidden"
              style={{ width: `${divinePercentage}%` }}
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
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-gray-800">Tu Realidad Financiera Actual</span>
            </div>
            <span className="text-2xl font-bold text-red-600">{currentPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
            <div 
              className="bg-gradient-to-r from-red-400 to-red-500 h-4 rounded-full shadow-lg"
              style={{ width: `${currentPercentage}%` }}
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
              {divinePercentage - currentPercentage}%
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
  );
}