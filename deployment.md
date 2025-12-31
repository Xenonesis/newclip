# Deployment Guide

## ClipFlow AI - Infrastructure & Deployment

---

## 🏗️ Infrastructure Overview

### Cloud Providers

| Component  | Provider   | Service           |
| ---------- | ---------- | ----------------- |
| Frontend   | Vercel     | Edge Functions    |
| Backend    | AWS        | EKS (Kubernetes)  |
| AI Workers | AWS        | EC2 GPU (g4dn)    |
| Database   | AWS        | RDS PostgreSQL    |
| Cache      | AWS        | ElastiCache Redis |
| Storage    | Cloudflare | R2                |
| CDN        | Cloudflare | CDN               |
| DNS        | Cloudflare | DNS               |

---

## 📦 Environment Setup

### Prerequisites

```bash
# Required tools
node >= 20.0.0
pnpm >= 8.0.0
docker >= 24.0.0
kubectl >= 1.28.0
terraform >= 1.5.0
aws-cli >= 2.0.0
```

### Environment Variables

```env
# Application
NODE_ENV=production
APP_URL=https://app.clipflow.ai
API_URL=https://api.clipflow.ai

# Database
DATABASE_URL=postgresql://user:pass@host:5432/clipflow
REDIS_URL=redis://host:6379

# Auth
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=https://app.clipflow.ai
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Storage
S3_BUCKET=clipflow-media
S3_REGION=us-east-1
R2_ACCOUNT_ID=xxx
R2_ACCESS_KEY=xxx
R2_SECRET_KEY=xxx

# AI
OPENAI_API_KEY=xxx

# Payments
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx

# Monitoring
SENTRY_DSN=xxx
DATADOG_API_KEY=xxx
```

---

## 🚀 Deployment Pipeline

### CI/CD Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ecr.aws/clipflow/api:${{ github.sha }}

  deploy-staging:
    needs: build
    environment: staging
    runs-on: ubuntu-latest
    steps:
      - run: kubectl set image deployment/api api=ecr.aws/clipflow/api:${{ github.sha }}

  e2e-tests:
    needs: deploy-staging
    runs-on: ubuntu-latest
    steps:
      - run: pnpm playwright test

  deploy-prod:
    needs: e2e-tests
    environment: production
    runs-on: ubuntu-latest
    steps:
      - run: kubectl set image deployment/api api=ecr.aws/clipflow/api:${{ github.sha }}
```

---

## 🐳 Docker Configuration

### API Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### AI Worker Dockerfile

```dockerfile
FROM nvidia/cuda:12.0-runtime-ubuntu22.04
RUN apt-get update && apt-get install -y python3.11 python3-pip ffmpeg
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python3", "worker.py"]
```

---

## ☸️ Kubernetes Configuration

### Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: clipflow
```

### API Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: clipflow
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: ecr.aws/clipflow/api:latest
          ports:
            - containerPort: 3000
          envFrom:
            - secretRef:
                name: clipflow-secrets
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "1Gi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
```

### Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: clipflow
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

## 🗄️ Database Setup

### PostgreSQL (RDS)

```hcl
# terraform/rds.tf
resource "aws_db_instance" "main" {
  identifier           = "clipflow-prod"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.r6g.xlarge"
  allocated_storage    = 100
  max_allocated_storage = 500

  db_name  = "clipflow"
  username = var.db_username
  password = var.db_password

  multi_az               = true
  storage_encrypted      = true
  backup_retention_period = 7

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
}
```

### Redis (ElastiCache)

```hcl
resource "aws_elasticache_replication_group" "main" {
  replication_group_id = "clipflow-redis"
  description          = "ClipFlow Redis Cluster"
  node_type            = "cache.r6g.large"
  num_cache_clusters   = 3
  engine               = "redis"
  engine_version       = "7.0"

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]
}
```

---

## 📊 Monitoring Setup

### Datadog Agent

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: datadog-agent
spec:
  selector:
    matchLabels:
      app: datadog-agent
  template:
    spec:
      containers:
        - name: agent
          image: datadog/agent:latest
          env:
            - name: DD_API_KEY
              valueFrom:
                secretKeyRef:
                  name: datadog-secret
                  key: api-key
            - name: DD_LOGS_ENABLED
              value: "true"
            - name: DD_APM_ENABLED
              value: "true"
```

### Health Checks

| Endpoint   | Purpose            |
| ---------- | ------------------ |
| `/health`  | Liveness probe     |
| `/ready`   | Readiness probe    |
| `/metrics` | Prometheus metrics |

---

## 🔄 Rollback Procedure

```bash
# View deployment history
kubectl rollout history deployment/api -n clipflow

# Rollback to previous version
kubectl rollout undo deployment/api -n clipflow

# Rollback to specific revision
kubectl rollout undo deployment/api --to-revision=3 -n clipflow
```

---

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Security scan clean
- [ ] Database migrations ready
- [ ] Environment variables updated
- [ ] Backup completed

### Post-Deployment

- [ ] Health checks passing
- [ ] Smoke tests passing
- [ ] Monitoring active
- [ ] Logs verified
- [ ] Users notified (if needed)

---

## 🆘 Troubleshooting

| Issue                      | Solution                                 |
| -------------------------- | ---------------------------------------- |
| Pod CrashLoopBackOff       | Check logs: `kubectl logs pod-name`      |
| Database connection failed | Verify security groups, credentials      |
| High latency               | Check HPA, scale manually if needed      |
| 5xx errors                 | Check application logs, container health |

### Useful Commands

```bash
# View pods
kubectl get pods -n clipflow

# View logs
kubectl logs -f deployment/api -n clipflow

# Exec into container
kubectl exec -it pod-name -n clipflow -- /bin/sh

# Port forward for debugging
kubectl port-forward svc/api 3000:3000 -n clipflow
```
