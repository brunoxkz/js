import React, { useState, useEffect } from 'react';
import { BarChart3, Users, TrendingDown, TrendingUp, Clock, Download, Trash2, RefreshCw, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { AnalyticsStorage } from '../../utils/analyticsStorage';
import { AnalyticsData, StepAnalytics } from '../../types/analytics';

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    setLoading(true);
    try {
      const data = AnalyticsStorage.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const data = AnalyticsStorage.exportAnalytics();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting analytics:', error);
    }
  };

  const handleClear = () => {
    if (window.confirm('¿Estás seguro de que quieres limpiar todos los datos de analytics? Esta acción no se puede deshacer.')) {
      AnalyticsStorage.clearAnalytics();
      loadAnalytics();
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStepName = (stepName: string): string => {
    const names: Record<string, string> = {
      'landing': 'Landing Page',
      'birthdate': 'Data de Nascimento',
      'color-selection': 'Seleção de Cor',
      'name-capture': 'Captura de Nome',
      'favorite-number': 'Número Favorito',
      'destiny-wheel': 'Roda do Destino',
      'processing-code': 'Processando Código',
      'code-reveal': 'Revelação do Código',
      'quiz': 'Quiz',
      'block-transition': 'Transição de Bloco',
      'processing-final': 'Processamento Final',
      'diagnosis': 'Diagnóstico',
      'liberation-ritual': 'Ritual de Liberação',
      'wall-breaking': 'Quebra da Parede',
      'offer': 'Oferta'
    };
    return names[stepName] || stepName;
  };

  const getStepExplanation = (stepName: string): string => {
    const explanations: Record<string, string> = {
      'landing': 'Primeira impressão - Taxa de conversão indica quantos visitantes continuam para o próximo passo',
      'birthdate': 'Captura de dados pessoais - Taxa de abandono alta pode indicar resistência a fornecer informações',
      'color-selection': 'Engajamento interativo - Baixa conversão pode indicar confusão na interface',
      'name-capture': 'Personalização - Etapa crítica para criar conexão pessoal',
      'favorite-number': 'Continuação do engajamento - Deve ter alta conversão se chegou até aqui',
      'destiny-wheel': 'Gamificação - Etapa divertida que deve manter o engajamento',
      'processing-code': 'Expectativa - Tempo de carregamento crítico para manter atenção',
      'code-reveal': 'Momento de revelação - Taxa de conversão indica impacto emocional',
      'quiz': 'Qualificação - Identifica problemas e dores do lead',
      'block-transition': 'Autoridade - Constrói credibilidade entre blocos de perguntas',
      'processing-final': 'Suspense - Preparação para o diagnóstico',
      'diagnosis': 'Agitação da dor - Deve criar urgência para a solução',
      'liberation-ritual': 'Experiência emocional - Prepara para a oferta',
      'wall-breaking': 'Interação final - Última etapa antes da oferta',
      'offer': 'Conversão final - Taxa de conversão é o KPI mais importante'
    };
    return explanations[stepName] || 'Etapa do funil de conversão';
  };

  const getConversionBenchmark = (stepName: string): { good: number; average: number; poor: number } => {
    const benchmarks: Record<string, { good: number; average: number; poor: number }> = {
      'landing': { good: 80, average: 60, poor: 40 },
      'birthdate': { good: 70, average: 50, poor: 30 },
      'color-selection': { good: 85, average: 70, poor: 50 },
      'name-capture': { good: 75, average: 55, poor: 35 },
      'favorite-number': { good: 90, average: 75, poor: 60 },
      'destiny-wheel': { good: 85, average: 70, poor: 55 },
      'processing-code': { good: 95, average: 85, poor: 70 },
      'code-reveal': { good: 80, average: 65, poor: 45 },
      'quiz': { good: 70, average: 50, poor: 30 },
      'block-transition': { good: 90, average: 80, poor: 65 },
      'processing-final': { good: 95, average: 85, poor: 70 },
      'diagnosis': { good: 75, average: 60, poor: 40 },
      'liberation-ritual': { good: 85, average: 70, poor: 55 },
      'wall-breaking': { good: 80, average: 65, poor: 50 },
      'offer': { good: 15, average: 8, poor: 3 }
    };
    return benchmarks[stepName] || { good: 70, average: 50, poor: 30 };
  };

  const getPerformanceStatus = (conversionRate: number, stepName: string): { status: 'good' | 'average' | 'poor'; color: string; icon: React.ReactNode } => {
    const benchmark = getConversionBenchmark(stepName);
    
    if (conversionRate >= benchmark.good) {
      return { status: 'good', color: 'text-green-600', icon: <CheckCircle className="w-4 h-4" /> };
    } else if (conversionRate >= benchmark.average) {
      return { status: 'average', color: 'text-yellow-600', icon: <AlertCircle className="w-4 h-4" /> };
    } else {
      return { status: 'poor', color: 'text-red-600', icon: <AlertCircle className="w-4 h-4" /> };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Erro ao carregar dados de analytics</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Última atualização: {new Date(analytics.lastUpdated).toLocaleString()}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            <Info className="w-4 h-4" />
            <span>{showExplanation ? 'Ocultar' : 'Mostrar'} Explicações</span>
          </button>
          
          <button
            onClick={loadAnalytics}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Atualizar</span>
          </button>
          
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
          
          <button
            onClick={handleClear}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {/* Explanation Panel */}
      {showExplanation && (
        <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-4">📊 Como Interpretar os Analytics</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Taxa de Conversão:</h4>
              <ul className="space-y-1 text-blue-600">
                <li>• <strong>100%</strong> = Todos que chegaram nesta etapa continuaram</li>
                <li>• <strong>50%</strong> = Metade dos visitantes abandonou aqui</li>
                <li>• <strong>0%</strong> = Ninguém passou desta etapa (problema crítico)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Taxa de Abandono:</h4>
              <ul className="space-y-1 text-blue-600">
                <li>• <strong>0%</strong> = Ninguém abandonou (ideal)</li>
                <li>• <strong>50%</strong> = Metade abandonou nesta etapa</li>
                <li>• <strong>100%</strong> = Todos abandonaram aqui (crítico)</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm">
              <strong>Dica:</strong> Foque nas etapas com maior taxa de abandono para otimizar o funil. 
              A etapa "Oferta" naturalmente tem conversão mais baixa (5-15% é normal).
            </p>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Leads</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalLeads}</p>
              <p className="text-xs text-gray-500 mt-1">Visitantes únicos que iniciaram o funil</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Funis Completos</p>
              <p className="text-3xl font-bold text-green-600">{analytics.completedFunnels}</p>
              <p className="text-xs text-gray-500 mt-1">Leads que chegaram até a oferta</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão Geral</p>
              <p className="text-3xl font-bold text-purple-600">{analytics.overallConversionRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">Do landing até a oferta</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Step Analytics Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Analytics Detalhado por Etapa</h2>
          <p className="text-gray-600 text-sm mt-1">
            Análise completa do funil de conversão com benchmarks de performance
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etapa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visitas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completaram
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Abandonaram
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa Conversão
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa Abandono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tempo Médio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.stepAnalytics.map((step) => {
                const performance = getPerformanceStatus(step.conversionRate, step.stepName);
                
                return (
                  <tr key={step.stepName} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-bold text-sm">{step.stepNumber}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getStepName(step.stepName)}
                          </div>
                          <div className="text-sm text-gray-500">{step.stepName}</div>
                          {showExplanation && (
                            <div className="text-xs text-gray-400 mt-1 max-w-xs">
                              {getStepExplanation(step.stepName)}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">{step.totalVisits}</div>
                      {step.stepNumber > 1 && (
                        <div className="text-xs text-gray-500">
                          {step.totalVisits > 0 ? 
                            `${((step.totalVisits / analytics.totalLeads) * 100).toFixed(1)}% do total` : 
                            '0% do total'
                          }
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                      <div>{step.completions}</div>
                      {step.totalVisits > 0 && (
                        <div className="text-xs text-gray-500">
                          {((step.completions / step.totalVisits) * 100).toFixed(1)}% continuaram
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                      <div>{step.abandonments}</div>
                      {step.totalVisits > 0 && (
                        <div className="text-xs text-gray-500">
                          {((step.abandonments / step.totalVisits) * 100).toFixed(1)}% abandonaram
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              performance.status === 'good' ? 'bg-green-600' :
                              performance.status === 'average' ? 'bg-yellow-600' : 'bg-red-600'
                            }`}
                            style={{ width: `${Math.min(step.conversionRate, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 font-medium">
                          {step.conversionRate.toFixed(1)}%
                        </span>
                      </div>
                      {showExplanation && (
                        <div className="text-xs text-gray-500 mt-1">
                          Meta: {getConversionBenchmark(step.stepName).good}%+
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(step.abandonmentRate, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{step.abandonmentRate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-1" />
                        {formatTime(step.averageTimeSpent)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center space-x-1 ${performance.color}`}>
                        {performance.icon}
                        <span className="text-sm font-medium capitalize">{performance.status}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📈 Resumo de Performance</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">✅ Etapas com Boa Performance</h4>
            <div className="space-y-1">
              {analytics.stepAnalytics
                .filter(step => getPerformanceStatus(step.conversionRate, step.stepName).status === 'good')
                .map(step => (
                  <div key={step.stepName} className="text-sm text-green-700">
                    {getStepName(step.stepName)} ({step.conversionRate.toFixed(1)}%)
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Etapas para Otimizar</h4>
            <div className="space-y-1">
              {analytics.stepAnalytics
                .filter(step => getPerformanceStatus(step.conversionRate, step.stepName).status === 'average')
                .map(step => (
                  <div key={step.stepName} className="text-sm text-yellow-700">
                    {getStepName(step.stepName)} ({step.conversionRate.toFixed(1)}%)
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <h4 className="font-semibold text-red-800 mb-2">🚨 Etapas Críticas</h4>
            <div className="space-y-1">
              {analytics.stepAnalytics
                .filter(step => getPerformanceStatus(step.conversionRate, step.stepName).status === 'poor')
                .map(step => (
                  <div key={step.stepName} className="text-sm text-red-700">
                    {getStepName(step.stepName)} ({step.conversionRate.toFixed(1)}%)
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responses Section */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Respostas Mais Comuns</h2>
          <p className="text-gray-600 text-sm mt-1">
            Análise das respostas mais frequentes em cada etapa
          </p>
        </div>
        
        <div className="p-6">
          {analytics.stepAnalytics
            .filter(step => step.responses && Object.keys(step.responses).length > 0)
            .map(step => (
              <div key={step.stepName} className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {getStepName(step.stepName)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(step.responses || {})
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 6)
                    .map(([response, count]) => (
                      <div key={response} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-700 truncate flex-1 mr-2">{response}</span>
                          <div className="text-right">
                            <span className="text-sm font-bold text-blue-600">{count}</span>
                            <div className="text-xs text-gray-500">
                              {step.totalVisits > 0 ? `${((count / step.totalVisits) * 100).toFixed(1)}%` : '0%'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}