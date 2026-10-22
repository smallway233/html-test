# CAS 备案回执

资产评估业务报告备案回执站点。推送到 `main` 后，GitHub Actions 会自动构建 **linux/amd64** 镜像并推到 GHCR。

## 镜像

```bash
docker pull ghcr.io/aonbit/cas-receipt:amd64
```

```bash
docker run -d --name cas-receipt --restart unless-stopped \
  -p 127.0.0.1:8765:8765 \
  -p 127.0.0.1:8088:80 \
  -v "$PWD/data:/app/data" \
  ghcr.io/aonbit/cas-receipt:amd64
```

- `8765`：Python 服务（展示页 `/page_source.html`，编辑页 `/admin.html`）
- `80`：Nginx，含官方资源反代 `/info/`

## 本地构建

```bash
docker build --platform linux/amd64 -t cas-receipt:amd64 .
```
