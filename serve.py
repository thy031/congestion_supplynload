import http.server,os,re
class H(http.server.SimpleHTTPRequestHandler):
    def send_head(self):
        p=self.translate_path(self.path)
        if os.path.isdir(p) or 'Range' not in self.headers: return super().send_head()
        sz=os.path.getsize(p);m=re.match(r'bytes=(\d+)-(\d*)',self.headers['Range']);a=int(m[1]);b=int(m[2]) if m[2] else sz-1
        self.send_response(206);self.send_header('Content-Type',self.guess_type(p));self.send_header('Accept-Ranges','bytes')
        self.send_header('Content-Range',f'bytes {a}-{b}/{sz}');self.send_header('Content-Length',str(b-a+1));self.end_headers()
        f=open(p,'rb');f.seek(a);self._n=b-a+1;return f
    def copyfile(self,s,d):
        n=getattr(self,'_n',None)
        if n is None: return super().copyfile(s,d)
        d.write(s.read(n));self._n=None
http.server.test(H,port=8765)
