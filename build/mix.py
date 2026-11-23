import json,subprocess,re
info=json.load(open('tts/info.json'))
# scene ends
SL=[11,27,41,57,73,90,103,117,131,143.5]
def send(t):
    for e in SL:
        if t<e: return e
    return 143.5
SPD=1.2;GAP=.25;sched=[];prev=0
for i,s,e,d,w in info:
    d2=d/SPD
    st=max(s,prev+GAP)
    lim=send(s)-.2
    sp=SPD
    if st+d2>lim:                       # speed up more, up to 1.5
        sp=min(1.5,d/max(.5,lim-st));d2=d/sp
    sched.append((i,round(st,2),round(st+d2,2),round(sp,3)))
    prev=st+d2
for x in sched:print(x)
json.dump(sched,open('tts/sched.json','w'))
ins=[];fl=[]
for k,(i,st,en,sp) in enumerate(sched):
    ins+=['-i',f'tts/{i}.wav']
    fl.append(f'[{k}:a]atempo={sp},adelay={int(st*1000)}|{int(st*1000)},volume=1.6[a{k}]')
mixs=''.join(f'[a{k}]' for k in range(len(sched)))+f'amix=inputs={len(sched)}:normalize=0,apad=whole_dur=143.5,atrim=0:143.5[m]'
subprocess.run(['ffmpeg','-v','error','-y']+ins+['-filter_complex',';'.join(fl)+';'+mixs,'-map','[m]','-ar','44100','-ac','1','tts/narration.wav'],check=True)
