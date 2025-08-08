# Deployment Guide

This guide covers how to deploy the arXiv Research Hub application to various platforms and environments.

## 🚀 Deployment Overview

arXiv Research Hub is a static React application that can be deployed to any static hosting service. The application has no backend dependencies beyond the public arXiv API, making deployment straightforward.

## 📋 Pre-deployment Checklist

- [ ] All tests passing (`npm run test`)
- [ ] Build completes successfully (`npm run build`)
- [ ] No lint errors (`npm run lint`)
- [ ] Environment variables configured (if any)
- [ ] Dependencies updated and secure
- [ ] Performance metrics verified

## 🌐 Platform-Specific Deployments

### Vercel (Recommended)

Vercel provides excellent support for React applications with automatic CI/CD.

#### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ppiova/arxiv-research-hub)

#### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Configuration** (vercel.json)
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "framework": "vite",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

### Netlify

Netlify offers seamless deployment with drag-and-drop and Git integration.

#### Quick Deploy

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or connect your Git repository at [Netlify](https://app.netlify.com)

#### Configuration

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

Deploy directly from your GitHub repository.

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deployment script** to package.json:
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Build and deploy**
   ```bash
   npm run build
   npm run deploy
   ```

4. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose `gh-pages` branch

### AWS S3 + CloudFront

For enterprise deployments with global CDN.

#### Setup

1. **Create S3 bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **Configure bucket for static hosting**
   ```bash
   aws s3 website s3://your-bucket-name \
     --index-document index.html \
     --error-document index.html
   ```

3. **Upload build files**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-bucket-name --delete
   ```

4. **Create CloudFront distribution**
   ```json
   {
     "Origins": [{
       "DomainName": "your-bucket-name.s3.amazonaws.com",
       "OriginPath": "",
       "CustomOriginConfig": {
         "HTTPPort": 80,
         "HTTPSPort": 443,
         "OriginProtocolPolicy": "http-only"
       }
     }],
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-your-bucket-name",
       "ViewerProtocolPolicy": "redirect-to-https"
     }
   }
   ```

### Docker Deployment

For containerized deployments.

#### Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

#### Build and run

```bash
docker build -t arxiv-research-hub .
docker run -p 8080:80 arxiv-research-hub
```

## ⚙️ Environment Configuration

### Environment Variables

The application currently requires no environment variables as it uses the public arXiv API. However, you can configure:

```bash
# Optional: Custom API base URL
VITE_API_BASE_URL=http://export.arxiv.org/api

# Optional: Enable debug mode
VITE_DEBUG_MODE=true

# Optional: Analytics tracking
VITE_ANALYTICS_ID=your-analytics-id
```

### Build-time Configuration

Modify `vite.config.ts` for deployment-specific settings:

```typescript
export default defineConfig({
  base: '/arxiv-research-hub/', // For GitHub Pages subdirectory
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable in production
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-tabs', '@radix-ui/react-dialog'],
        }
      }
    }
  }
});
```

## 🔧 CI/CD Pipelines

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:$NODE_VERSION
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run lint
    - npm run test
    - npm run build

deploy:
  stage: deploy
  image: node:$NODE_VERSION
  only:
    - main
  script:
    - npm ci
    - npm run build
    - # Add your deployment commands here
  artifacts:
    paths:
      - dist/
```

## 📊 Performance Optimization

### Build Optimization

1. **Bundle Analysis**
   ```bash
   npm run build
   npx vite-bundle-analyzer
   ```

2. **Compression**
   ```bash
   # Enable gzip compression
   npm install --save-dev vite-plugin-compression
   ```

3. **Asset Optimization**
   ```javascript
   // vite.config.ts
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           assetFileNames: 'assets/[name].[hash][extname]',
           chunkFileNames: 'assets/[name].[hash].js',
         }
       }
     }
   });
   ```

### CDN Configuration

For optimal performance, serve static assets from a CDN:

```javascript
// vite.config.ts - for CDN deployment
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
```

## 🔒 Security Considerations

### Content Security Policy

Add CSP headers for security:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               connect-src 'self' http://export.arxiv.org;
               img-src 'self' data: https:;">
```

### HTTPS Enforcement

Ensure all deployments use HTTPS:

```nginx
# Nginx configuration
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Your app configuration
}
```

## 📈 Monitoring & Analytics

### Performance Monitoring

```javascript
// Add to main.tsx for performance tracking
if ('performance' in window) {
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    console.log('Page load time:', navigation.loadEventEnd - navigation.loadEventStart);
  });
}
```

### Error Tracking

Consider integrating error tracking services:

```javascript
// Example: Sentry integration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: import.meta.env.PROD ? 'production' : 'development',
});
```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Routing Issues**
   - Ensure your hosting service redirects all routes to `index.html`
   - Check base URL configuration in `vite.config.ts`

3. **CORS Issues**
   - The arXiv API supports CORS, but check browser console for errors
   - Ensure you're not making requests from `file://` protocol

4. **Performance Issues**
   - Check bundle size with `npm run build`
   - Verify gzip compression is enabled
   - Monitor Core Web Vitals

### Deployment Verification

After deployment, verify:

- [ ] All pages load correctly
- [ ] Search functionality works
- [ ] Topic filtering functions
- [ ] Dark/light mode toggle works
- [ ] Mobile responsiveness
- [ ] arXiv API integration
- [ ] Performance metrics (Lighthouse score)

## 🔄 Rollback Procedures

### Vercel Rollback

```bash
vercel --prod --rollback
```

### Manual Rollback

1. **Git revert**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Previous build deployment**
   ```bash
   # If you have previous builds stored
   aws s3 sync s3://your-backup-bucket s3://your-live-bucket
   ```

---

This deployment guide covers the most common deployment scenarios for the arXiv Research Hub. Choose the platform that best fits your needs and infrastructure requirements.