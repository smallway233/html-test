#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""本地静态服务 + 保存 report.json"""

import json
import os
from http.server import SimpleHTTPRequestHandler, HTTPServer
from pathlib import Path
from socketserver import ThreadingMixIn
from urllib.parse import urlparse

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
        if parsed.path in ("/api/report", "/api/report.json"):
            self._send_json_file()
            return
        super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path in ("/api/report", "/api/save"):
            self._save_report()
            return
        self.send_error(404, "Not Found")

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
