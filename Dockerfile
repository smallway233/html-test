FROM alpine:3.21

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HOST=0.0.0.0 \
    PORT=8765

WORKDIR /app

# 默认 Alpine CDN 在国内较慢，构建时改用阿里云源
RUN sed -i 's#https://dl-cdn.alpinelinux.org#https://mirrors.aliyun.com#g' /etc/apk/repositories \
    && apk add --no-cache python3 nginx \
    && adduser -D -u 1000 app

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/start.sh /start.sh
COPY . /app

RUN chmod +x /start.sh \
    && mkdir -p /app/data /var/lib/nginx/tmp /run/nginx \
    && chown -R app:app /app \
    && chown -R nginx:nginx /var/lib/nginx /run/nginx

EXPOSE 80 8765

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8765/data/report.json')"

CMD ["/start.sh"]
