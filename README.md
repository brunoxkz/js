# Divine Quiz - Sistema de Tradução Automática

## 🌍 Idiomas Suportados

- **Español** 🇪🇸 (Padrão)
- **Português** 🇧🇷 
- **English** 🇺🇸

## 🚀 Como Funciona

### 1. Seleção de Idioma
- Primeira tela permite escolher o idioma preferido
- Detecção automática baseada no navegador
- Preferência salva no localStorage

### 2. Tradução Automática
- Sistema de tradução integrado com hook `useTranslation`
- Todas as strings são traduzidas automaticamente
- Fallback para espanhol se tradução não encontrada

### 3. Persistência
- Idioma selecionado é salvo localmente
- Mantém preferência entre sessões
- Dados do usuário incluem idioma selecionado

## 📱 Como Testar no Celular

### Opção 1: Desenvolvimento Local
```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Encontrar seu IP local
# Windows: ipconfig
# Mac/Linux: ifconfig

# 4. Acessar no celular
# http://SEU_IP:5173
# Exemplo: http://192.168.1.100:5173
```

### Opção 2: Deploy Rápido (Netlify)
```bash
# 1. Build do projeto
npm run build

# 2. Deploy no Netlify
# - Arraste a pasta 'dist' para netlify.com/drop
# - Ou conecte o repositório GitHub
```

### Opção 3: Tunnel Local (ngrok)
```bash
# 1. Instalar ngrok
npm install -g ngrok

# 2. Expor porta local
ngrok http 5173

# 3. Usar URL fornecida no celular
```

## 🔧 Configuração do Áudio (Eleven Labs)

1. Crie conta em [elevenlabs.io](https://elevenlabs.io/)
2. Copie sua API key
3. Crie arquivo `.env`:
```env
VITE_ELEVEN_LABS_API_KEY=sua_api_key_aqui
```

## 🎯 Funcionalidades de Tradução

### Hook useTranslation
```typescript
const { t, currentLanguage, changeLanguage } = useTranslation();

// Usar tradução
const text = t('landing.title');

// Mudar idioma
changeLanguage('pt');
```

### Estrutura de Traduções
```typescript
const translations = {
  'landing.title': {
    es: 'Texto en español',
    pt: 'Texto em português', 
    en: 'Text in English'
  }
};
```

## 📋 Checklist de Teste

### Desktop
- [ ] Seleção de idioma funciona
- [ ] Tradução automática ativa
- [ ] Áudio personalizado (se configurado)
- [ ] Navegação entre etapas

### Mobile
- [ ] Interface responsiva
- [ ] Touch interactions funcionam
- [ ] Botões flutuantes acessíveis
- [ ] Performance adequada
- [ ] Áudio funciona (se disponível)

## 🐛 Troubleshooting

### Áudio não funciona no mobile
- Verifique se HTTPS está ativo
- Teste interação do usuário primeiro
- Fallback para Web Speech API

### Tradução não aparece
- Verifique se a chave existe em `translations`
- Confirme idioma selecionado
- Veja console para erros

### Performance lenta
- Otimize imagens
- Reduza animações em dispositivos antigos
- Use lazy loading quando possível

## 🔄 Fluxo Completo

1. **Seleção de Idioma** → Escolha do idioma preferido
2. **Landing** → Página inicial traduzida
3. **Data de Nascimento** → Captura traduzida
4. **Seleção de Cor** → Interface traduzida
5. **Nome** → Captura com feedback traduzido
6. **Número Favorito** → Seleção traduzida
7. **Roda do Destino** → Interação traduzida
8. **Processamento** → Loading traduzido
9. **Revelação do Código** → Resultado traduzido
10. **Quiz** → Perguntas traduzidas
11. **Diagnóstico** → Análise traduzida
12. **Ritual de Liberação** → Experiência traduzida
13. **Quebra da Parede** → Interação traduzida
14. **Oferta** → Pitch traduzido com áudio personalizado

## 🎨 Personalização

### Adicionar Novo Idioma
1. Adicione ao tipo `Language`
2. Inclua traduções em `translations`
3. Adicione à lista `languages`
4. Teste todas as telas

### Modificar Traduções
1. Edite arquivo `useTranslation.ts`
2. Adicione novas chaves conforme necessário
3. Mantenha consistência entre idiomas

---

**🚀 Pronto para testar! O sistema agora suporta tradução automática completa em 3 idiomas.**