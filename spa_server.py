import http.server
import socketserver
import os
import sys

PORT = 8089
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dist')

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_GET(self):
        # Si el archivo existe directamente, sírvelo
        path = self.translate_path(self.path)
        if not os.path.exists(path) or os.path.isdir(path):
            # Para rutas de SPA (como /(tabs), /chat/trip-1), sirve index.html
            self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
        print(f"SPA Server running on port {PORT} serving {DIST_DIR}")
        sys.stdout.flush()
        httpd.serve_forever()
