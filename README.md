# CAS 备案回执

资产评估业务报告备案回执站点。推送到 `main` 后，GitHub Actions 会自动构建 **linux/amd64** 镜像并推到 GHCR。

## 镜像

```bash
docker pull ghcr.io/smallway233/html-test:amd64
```

端口不要绑 `127.0.0.1`，否则局域网其他设备访问不到：

```bash
docker run -d --name cas-receipt --restart unless-stopped \
  -p 8765:8765 \
  -p 8088:80 \
  -v "$PWD/data:/app/data" \
  ghcr.io/smallway233/html-test:amd64
```

同一局域网内用本机 IP 访问（把 `192.168.x.x` 换成实际地址）：

- 展示页：http://192.168.x.x:8088/page_source.html
- 编辑页：http://192.168.x.x:8088/admin.html

请走 **8088**（容器内 Nginx）。这里带有官方资源反代 `/info/`；只开 8765 时样式会 405。

手机扫码请在编辑页把二维码设为「当前页面」，或自定义成上面的局域网地址。

- `8765`：Python 服务
- `8088`→`80`：Nginx，含 `/info/` 反代

## 本地构建

```bash
docker compose up -d --build
```
