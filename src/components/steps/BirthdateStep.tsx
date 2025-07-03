import React, { useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';

interface BirthdateStepProps {
  onNext: () => void;
  onUpdateBirthDate: (day: string, month: string, year: string) => void;
}

export function BirthdateStep({ onNext, onUpdateBirthDate }: BirthdateStepProps) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (day && month && year) {
      onUpdateBirthDate(day, month, year);
      onNext();
    }
  };

  const isValid = day && month && year && 
    parseInt(day) >= 1 && parseInt(day) <= 31 &&
    parseInt(month) >= 1 && parseInt(month) <= 12 &&
    parseInt(year) >= 1900 && parseInt(year) <= new Date().getFullYear();

  // Función para obtener el signo zodiacal
  const getZodiacSign = (day: string, month: string) => {
    if (!day || !month) return null;
    
    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    
    const zodiacSigns = [
      { name: 'Capricornio', emoji: '♑', dates: [[12, 22], [1, 19]] },
      { name: 'Acuario', emoji: '♒', dates: [[1, 20], [2, 18]] },
      { name: 'Piscis', emoji: '♓', dates: [[2, 19], [3, 20]] },
      { name: 'Aries', emoji: '♈', dates: [[3, 21], [4, 19]] },
      { name: 'Tauro', emoji: '♉', dates: [[4, 20], [5, 20]] },
      { name: 'Géminis', emoji: '♊', dates: [[5, 21], [6, 20]] },
      { name: 'Cáncer', emoji: '♋', dates: [[6, 21], [7, 22]] },
      { name: 'Leo', emoji: '♌', dates: [[7, 23], [8, 22]] },
      { name: 'Virgo', emoji: '♍', dates: [[8, 23], [9, 22]] },
      { name: 'Libra', emoji: '♎', dates: [[9, 23], [10, 22]] },
      { name: 'Escorpio', emoji: '♏', dates: [[10, 23], [11, 21]] },
      { name: 'Sagitario', emoji: '♐', dates: [[11, 22], [12, 21]] }
    ];

    for (const sign of zodiacSigns) {
      const [[startMonth, startDay], [endMonth, endDay]] = sign.dates;
      
      if (
        (monthNum === startMonth && dayNum >= startDay) ||
        (monthNum === endMonth && dayNum <= endDay)
      ) {
        return sign;
      }
    }
    
    return null;
  };

  const zodiacSign = getZodiacSign(day, month);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 flex items-center justify-center px-4 pb-24">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-yellow-200">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            {/* Ícone com brilho pulsante divino */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4">
              {/* Anéis de luz pulsantes */}
              <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-ping"></div>
              <div className="absolute -inset-6 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-15 animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute -inset-8 bg-gradient-to-r from-yellow-200 to-orange-200 rounded-full opacity-10 animate-ping" style={{ animationDelay: '1s' }}></div>
              
              {/* Ícone principal com brilho */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                <Calendar className="w-8 h-8 md:w-10 md:h-10 text-white" />
                
                {/* Brilho interno */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full animate-pulse"></div>
              </div>
              
              {/* Partículas de luz */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-bounce"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(-${25 + i * 3}px)`,
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              ¡Tu fecha de nacimiento contiene el
            </h2>
            <div className="relative inline-block">
              <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                CÓDIGO DE ACTIVACIÓN
              </h3>
              <Sparkles className="absolute -top-2 -right-6 md:-right-8 w-5 h-5 md:w-6 md:h-6 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-gray-600 mt-3 text-sm md:text-base">
              que Dios colocó en ti desde el vientre materno
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Día
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="DD"
                    min="1"
                    max="31"
                    className="w-full px-3 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-lg text-center font-semibold relative overflow-hidden"
                    required
                  />
                  {/* Animação dourada na borda quando focado */}
                  {day && (
                    <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg pointer-events-none">
                      <div className="absolute inset-0 border-2 border-yellow-300 rounded-lg animate-ping opacity-50"></div>
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-pulse" style={{ animationDelay: '0.25s' }}></div>
                      <div className="absolute right-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-pulse" style={{ animationDelay: '0.75s' }}></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mes
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    placeholder="MM"
                    min="1"
                    max="12"
                    className="w-full px-3 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-lg text-center font-semibold relative overflow-hidden"
                    required
                  />
                  {month && (
                    <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg pointer-events-none">
                      <div className="absolute inset-0 border-2 border-yellow-300 rounded-lg animate-ping opacity-50"></div>
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-pulse" style={{ animationDelay: '0.25s' }}></div>
                      <div className="absolute right-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-pulse" style={{ animationDelay: '0.75s' }}></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="AAAA"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-3 border-2 border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 text-lg text-center font-semibold relative overflow-hidden"
                    required
                  />
                  {year && (
                    <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg pointer-events-none">
                      <div className="absolute inset-0 border-2 border-yellow-300 rounded-lg animate-ping opacity-50"></div>
                      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                      <div className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-pulse" style={{ animationDelay: '0.25s' }}></div>
                      <div className="absolute right-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-pulse" style={{ animationDelay: '0.75s' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Signo Zodiacal */}
            {zodiacSign && (
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl p-4 border-2 border-purple-200 animate-fade-in">
                <div className="text-center">
                  <h4 className="text-lg font-bold text-purple-800 mb-2">
                    ✨ Tu Signo Zodiacal ✨
                  </h4>
                  <div className="flex items-center justify-center space-x-3">
                    <span className="text-3xl">{zodiacSign.emoji}</span>
                    <span className="text-xl font-bold text-purple-700">{zodiacSign.name}</span>
                  </div>
                  <p className="text-purple-600 text-sm mt-2">
                    Este signo potenciará tu código divino de manera única
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!isValid}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-lg shadow-lg"
            >
              REVELAR MI CÓDIGO DIVINO
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              🔮 Este análisis está basado en principios bíblicos de numerología sagrada
            </p>
          </div>
        </div>
      </div>

      {/* Floating CTA Button */}
      {isValid && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-yellow-200 p-4 shadow-lg z-50">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              <span className="relative flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-lg">REVELAR CÓDIGO AHORA</span>
                <Sparkles className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}