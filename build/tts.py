import re,subprocess,json
m=open('main.js').read()
a=m.index('const CAP=[');b=m.index('const BUB')
caps=[(float(s),float(e),t) for s,e,t in re.findall(r'\[([\d.]+),([\d.]+),"(.*?)"\]',m[a:b])]
def spoken(t):
    t=t.replace('−',' minus ').replace('+1.5','plus 1.5').replace('+1','plus 1').replace(' = ',' equals ').replace('surplus =','surplus equals')
    t=t.replace('GCells','G cells').replace('GCell','G cell').replace('RUDY','Rudy').replace('oversubscribed','over subscribed')
    t=t.replace('“greater than”','greater than').replace('…','.').replace("nets'","nets")
    t=re.sub(r'(\d)\.0\b',r'\1',t)
    return t
info=[]
for i,(s,e,t) in enumerate(caps):
    open(f'tts/{i}.txt','w').write(spoken(t))
    subprocess.run(['ffmpeg','-v','error','-y','-f','lavfi','-i',f'flite=textfile=tts/{i}.txt:voice=slt','-ar','44100','tts/{}.wav'.format(i)],check=True)
    d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'tts/{i}.wav']))
    info.append((i,s,e,round(d,2),round(e-s,2)))
for x in info:print(x)
json.dump(info,open('tts/info.json','w'))
