from http.server import BaseHTTPRequestHandler, HTTPServer
from PIL import Image
from google.cloud import translate
import json, base64, os, pytesseract
from bs4 import BeautifulSoup

port = 8080
class MyHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)
        translate_client = translate.Client()
        if data['type'] == 'img':
            imgdata = base64.b64decode(data['image'][22:])
            filename = 'received.jpg'
            with open(filename, 'wb') as f:
                f.write(imgdata)
            print('Received image. Cleaning text.')
            os.system('./textcleaner -g -e stretch -f 25 -o 10 -u -s 1 -T -p 10 received.jpg processed.jpg')
            os.system('./textdeskew processed.jpg final.jpg')
            print('Cleaning completed. Detecting text.')
            dText = pytesseract.image_to_string(Image.open('final.jpg'), lang=data['srcLang'], config='--tessdata-dir "/home/metehan"')
            dText = dText.replace('-\n', '').replace('\n', ' ')
            print('Detected text: ' + dText)
            print('Translating.')
            translation = translate_client.translate(dText, target_language=data['destLang'])
            tText = translation['translatedText']
            soup = BeautifulSoup(tText, "lxml")
            tText = soup.get_text()
            print('Translated text: ' + tText)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                    'dText': dText,
                    'tText': tText
                    }).encode())
        elif data['type'] == 'txt':
            translation = translate_client.translate(data['text'], target_language=data['destLang'])
            tText = translation['translatedText']
            print(data['text'])
            print(tText)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                    'dText': data['text'],
                    'tText': tText
                    }).encode())


if __name__ == '__main__':
     httpd = HTTPServer(('', port), MyHandler)
     try:
         print("httpd started...")
         httpd.serve_forever()
     except KeyboardInterrupt:
         print('^C received, shutting down server')
         httpd.socket.close()
