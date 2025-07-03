# 🚀 Guia de Deploy para Produção

## 📁 Arquivos Gerados para Produção

A pasta `dist` contém todos os arquivos otimizados para produção:

```
dist/
├── index.html              # Página principal
├── assets/
│   ├── index-[hash].js     # JavaScript otimizado
│   └── index-[hash].css    # CSS otimizado
└── vite.svg               # Ícone
```

## 🔧 Como Fazer Deploy no cPanel

### 1. **Baixar os Arquivos**
- Baixe TODOS os arquivos da pasta `dist`
- Mantenha a estrutura de pastas

### 2. **Upload no cPanel**
- Acesse o File Manager do cPanel
- Vá para a pasta `public_html`
- Faça upload de TODOS os arquivos da pasta `dist`
- Mantenha a estrutura: `assets/` dentro de `public_html/`

### 3. **Configurar .htaccess (Importante!)**
Crie um arquivo `.htaccess` na pasta `public_html` com o conteúdo:

```apache
RewriteEngine On
RewriteBase /

# Handle Angular and React Router
RewriteRule ^(?!.*\.).*$ /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Compress files
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

## 🌐 Testando o Deploy

Após o upload, acesse seu domínio e verifique:
- ✅ A página carrega corretamente
- ✅ Todas as funcionalidades funcionam
- ✅ O admin está acessível em `seudominio.com/#admin`
- ✅ Os dados são salvos no localStorage

## 🔄 Para Futuras Atualizações

1. Edite os arquivos no VS Code
2. Execute `npm run build`
3. Substitua os arquivos na pasta `public_html`
4. Limpe o cache do navegador

## 📱 Otimizações Incluídas

- ✅ Código minificado
- ✅ CSS otimizado
- ✅ Imagens comprimidas
- ✅ Cache configurado
- ✅ Compatibilidade mobile
- ✅ Performance otimizada

## 🆘 Problemas Comuns

**Página em branco:** Verifique se o arquivo `.htaccess` foi criado
**Erro 404:** Certifique-se que todos os arquivos da pasta `assets/` foram enviados
**Não carrega:** Verifique se o `index.html` está na raiz do `public_html`

---

**✨ Seu quiz está pronto para receber leads!**