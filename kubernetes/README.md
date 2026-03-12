# Kubernetes Manifests - Order Service

**Prerequisites:** Database and product service must exist (namespace, configmap, secret).

## Apply

```bash
kubectl apply -f dev/deployment.yaml
kubectl apply -f dev/service.yaml
```

## Image Update (Jenkins)

```bash
kubectl set image deployment/ecomm-order-service order-service=FULL_IMAGE -n ecomm-dev
```

## NodePorts

| Env    | NodePort |
|--------|----------|
| dev    | 30002    |
| staging| 30102    |
| prod   | 30202    |
