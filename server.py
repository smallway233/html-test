#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""本地静态服务 + 保存 report.json"""

import json
import os
import ssl
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
from socketserver import ThreadingMixIn
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent
DATA_FILE = ROOT / "data" / "report.json"
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8765"))


class ThreadingHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # CentOS 7 的 Python 3.6 不支持 directory 参数，改用进程工作目录
        super(Handler, self).__init__(*args, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path in ("/api/report", "/api/report.json", "/data/report.json"):
            self._send_json_file()
            return
        if parsed.path.startswith("/info/"):
            self._proxy_uimp(self.path)
            return
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path in ("/api/report", "/api/save"):
            self._save_report()
            return
        if parsed.path.startswith("/info/"):
            self._proxy_uimp(self.path, method="POST")
            return
        self.send_error(404, "Not Found")

    def _proxy_uimp(self, raw_path, method="GET"):
        """把 /info/ 回源到官方站，查询参数必须带上，否则接口会空数据。"""
        parsed = urlparse(raw_path)
        url = "https://uimp.cas.org.cn" + parsed.path
        if parsed.query:
            url += "?" + parsed.query

        headers = {
            "User-Agent": "Mozilla/5.0",
            "Referer": "https://uimp.cas.org.cn/info/",
            "Origin": "https://uimp.cas.org.cn",
        }
        body = None
        if method == "POST":
            length = int(self.headers.get("Content-Length", "0") or "0")
            body = self.rfile.read(length) if length else b""
            headers["Content-Type"] = self.headers.get("Content-Type") or "application/x-www-form-urlencoded"

        req = Request(url, data=body, headers=headers, method=method)
        ctx = ssl.create_default_context()
        try:
            resp = urlopen(req, timeout=30, context=ctx)
            raw = resp.read()
            content_type = resp.headers.get("Content-Type") or "application/octet-stream"
            status = getattr(resp, "status", 200)
            resp.close()
        except Exception as exc:
            self.send_error(502, "回源失败: %s" % exc)
            return

        path_only = parsed.path
        if "css" in content_type or path_only.endswith(".css"):
            text = raw.decode("utf-8", "replace")
            text = text.replace("https://uimp.cas.org.cn/info", "/info")
            text = text.replace("url(/images/cxcasorgcn/", "url(/info/images/cxcasorgcn/")
            raw = text.encode("utf-8")
            content_type = "text/css; charset=utf-8"

        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def _send_json_file(self):
        if not DATA_FILE.exists():
            self.send_error(404, "report.json not found")
            return
        raw = DATA_FILE.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def _save_report(self):
        length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(length)
        try:
            data = json.loads(body.decode("utf-8"))
        except Exception as exc:
            self._json_response(400, {"ok": False, "error": f"JSON 无效: {exc}"})
            return

        DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
        text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
        DATA_FILE.write_text(text, encoding="utf-8")
        self._json_response(200, {"ok": True, "path": "data/report.json"})

    def _json_response(self, code: int, payload: dict):
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)

    def log_message(self, fmt, *args):
        print("[%s] %s" % (self.log_date_time_string(), fmt % args))


def main():
    os.chdir(ROOT)
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print("服务已启动:")
    print(f"  展示页: http://<服务器IP>:{PORT}/page_source.html")
    print(f"  编辑页: http://<服务器IP>:{PORT}/admin.html")
    print(f"  本地: http://127.0.0.1:{PORT}/page_source.html")
    print(f"  数据文件: {DATA_FILE}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n已停止")


if __name__ == "__main__":
    main()
