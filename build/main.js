/* ============ timeline ============ */
const DUR=143.5;
const SL=[
 {s:0,e:11,title:'Supply and load'},
 {s:11,e:27,title:'Think of a road'},
 {s:27,e:41,title:'Meet the GCell'},
 {s:41,e:57,title:'The bucket rule'},
 {s:57,e:73,title:'Find the hot tiles'},
 {s:73,e:90,title:'Make the road narrower'},
 {s:90,e:103,title:'Your turn!'},
 {s:103,e:117,title:'Three lines of code'},
 {s:117,e:131,title:'Three beginner traps'},
 {s:131,e:DUR,title:'Recap'}];
const CAP=[
[.8,5.5,"Welcome! Today we ask one simple question: is there enough room for all the wires on a chip?"],
[5.7,10.8,"Imagine the chip is a city. Every wire is a car, and each tile of the grid is one city block."],
[11.5,16,"Start with one block. This road has 2 lanes. Two lanes is its capacity."],
[16.3,21,"Wires arrive like cars. Car 1 fits. Car 2 fits. Now the road is full."],
[21.3,26.8,"Car 3 has no lane! Demand is 3, capacity is 2, so 3 − 2 = +1. That is a traffic jam."],
[27.5,33,"Real chips are cut into a grid of tiles called GCells. Each one keeps two numbers: demand and capacity."],
[33.3,40.5,"This tile holds cells A to F. Its demand is 3.5 but its capacity is only 2.0, so it is oversubscribed."],
[41.5,46,"Picture each tile as a bucket. Capacity is the line the water must not cross."],
[46.3,51.5,"Demand 1.0: plenty of room. Demand 2.0: full. Demand 3.2: it spills over!"],
[51.8,56.5,"surplus = demand − capacity. Zero or below is safe. Above zero means overflow."],
[57.5,62,"Now check the whole chip. We visit every tile and work out its surplus."],
[62.3,67.5,"Most tiles stay calm and blue. One tile turns yellow: 3.5 − 2.0 = +1.5."],
[67.8,72.5,"Before you trust a heat map, list the oversubscribed tiles. Here there is just one."],
[73.5,78.5,"What if the road gets narrower? Capacity is a knob, so let's turn it from 2.0 down to 1.0."],
[78.8,85,"Same wires, same tiles. Watch the borderline tiles turn yellow one by one."],
[85.3,89.5,"Lower capacity means more traffic jams. That is why capacity is part of the contract."],
[90.5,95,"Your turn! Capacity is 2.0. Demands are 1.4, 2.0, 2.6 and 3.0."],
[95.3,99.3,"How many are oversubscribed? Think for three seconds."],
[99.8,102.8,"Two! 2.6 and 3.0 are over. 2.0 is full, not over."],
[103.5,109,"In code it is just three lines: work out the surplus, keep tiles above zero, count them."],
[109.3,116.5,"Notice the strict “greater than”. A tile that is exactly full is not oversubscribed."],
[117.5,122,"Watch out for three beginner traps."],
[122.3,125.6,"One: compare wires with wires. Write your units down."],
[125.8,128.7,"Two: a zero tile beside hot tiles is not automatically safe."],
[128.9,131,"Three: reset the starter placement when you change capacity."],
[131.5,137,"Great job! You can compute surplus, spot hot tiles and explain why capacity matters."],
[137.3,143,"Up next: RUDY, the quick estimator that predicts demand from the nets' bounding boxes."]];
const BUB=[[1,'Hi! I\'m Pip!','h'],[11.5,'2 lanes = capacity','h'],[21.3,'No room!','s'],[27.5,'Tiles = GCells','h'],[41.5,'Spill = overflow','h'],[57.5,'Scan every tile','h'],[67.8,'1 hot tile','h'],[73.5,'Cap is a knob!','h'],[90.5,'Think… 3, 2, 1','h'],[99.8,'Careful: exactly full!','h'],[103.5,'Strictly  > 0','h'],[117.5,'Watch out!','w'],[131.5,'Well done!','h']];

const OKF='#EAF2FF',OKS='#9DBBF5',NEARF='#FFF6D6',NEARS='#E0A800',HOTF='#FFC400';
function sidx(t){for(let i=SL.length-1;i>=0;i--)if(t>=SL[i].s)return i;return 0}

/* ============ furniture ============ */
const DEFS=`<defs><filter id="sh" x="-5%" y="-5%" width="110%" height="120%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0A2A66" flood-opacity=".10"/></filter></defs>`;
function chrome(t,i){
  const sl=SL[i];let s=rect(0,0,1920,1080,0,'#F7FAFF');
  s+=rect(0,0,1920,8,0,MB)+rect(0,0,1920*clamp(t/DUR),8,0,BLUE);
  SL.forEach((x,k)=>{if(k)s+=rect(1920*x.s/DUR-2,0,4,8,0,'#fff')});
  if(i>0){s+=T(sl.title,80,104,56,NAVY,{w:700,f:'P'});s+=rect(80,122,Math.min(meas(sl.title,56,700,'P'),700),9,4,YEL);
    s+=T(String(i+1).padStart(2,'0')+' / '+String(SL.length).padStart(2,'0'),1840,92,26,GREY,{w:700,f:'P',a:'end'})}
  return s;
}
function caption(t){
  let c=null;for(const x of CAP)if(t>=x[0]&&t<x[1]+.3)c=x;if(!c)return '';
  const k=clamp(Math.min((t-c[0])/.3,(c[1]+.3-t)/.3)),size=32;
  const L=wrap(c[2],size,400,1380);const h=L.length*44+36;
  let s=`<g opacity="${f1(k*100)/100}">`+card(60,1040-h-6,1500,h,'#fff',20,`stroke="${MB}" stroke-width="3"`)+rect(60,1040-h-6,12,h,6,YEL);
  L.forEach((l,j)=>s+=T(l,100,1040-h-6+48+j*44,size,NAVY));
  return s+'</g>';
}
function pip(t,mood,x,y,sc=1){
  const bob=Math.sin(t*3)*4;let s=`<g transform="translate(${x} ${f1(y+bob)}) scale(${sc})">`;
  s+=`<ellipse cx="0" cy="${72-bob}" rx="52" ry="8" fill="#0A2A66" opacity=".1"/>`;
  s+=`<line x1="0" y1="-62" x2="0" y2="-88" stroke="${NEARS}" stroke-width="5"/>`+circ(0,-92,9,BLUE);
  s+=circ(0,0,64,YEL,`stroke="${NEARS}" stroke-width="5"`)+`<ellipse cx="-20" cy="-36" rx="22" ry="9" fill="#fff" opacity=".35"/>`;
  s+=circ(-40,14,11,'#FFE08A')+circ(40,14,11,'#FFE08A');
  if(mood==='s'){s+=circ(-21,-8,10,NAVY)+circ(21,-8,10,NAVY)+circ(-18,-11,3,'#fff')+circ(24,-11,3,'#fff')+`<ellipse cx="0" cy="30" rx="9" ry="12" fill="${NAVY}"/>`}
  else if(mood==='w'){s+=circ(-21,-6,9,NAVY)+circ(21,-6,9,NAVY)+`<path d="M -16 38 Q 0 24 16 38" fill="none" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/><line x1="-34" y1="-26" x2="-10" y2="-20" stroke="${NAVY}" stroke-width="5" stroke-linecap="round"/><line x1="34" y1="-26" x2="10" y2="-20" stroke="${NAVY}" stroke-width="5" stroke-linecap="round"/>`}
  else{s+=circ(-21,-6,9,NAVY)+circ(21,-6,9,NAVY)+circ(-18,-9,3,'#fff')+circ(24,-9,3,'#fff')+`<path d="M -20 22 Q 0 42 20 22" fill="none" stroke="${NAVY}" stroke-width="6" stroke-linecap="round"/>`}
  return s+'</g>';
}
function bubble(t){
  let b=null;for(const x of BUB)if(t>=x[0])b=x;if(!b)return '';
  const k=eo((t-b[0])/.35),tw=meas(b[1],30,700,'P')+56;
  let s=`<g opacity="${f1(k*100)/100}" transform="translate(0 ${f1((1-k)*10)})">`;
  s+=rect(1690-tw,846,tw,64,32,'#fff',`stroke="${BLUE}" stroke-width="5" filter="url(#sh)"`)+`<polygon points="1668,906 1700,906 1706,934" fill="#fff" stroke="${BLUE}" stroke-width="5" stroke-linejoin="round"/>`+rect(1669,900,32,10,0,'#fff');
  return s+T(b[1],1690-tw/2,889,30,NAVY,{w:700,a:'middle',f:'P'})+'</g>';
}

/* ============ components ============ */
const DEM=[[.2,.5,.3,0],[.4,1.4,1.2,.2],[1.1,3.5,1.3,.3]];
const CL={A:[-.5,-.45],B:[.45,-.35],F:[-.15,-.5],E:[0,0],C:[-.45,.45],D:[.45,.45]};
const CC={A:'#1F5FE0',B:'#3B7BF2',C:'#0A2A66',D:'#6A9BF7',E:YEL,F:'#2A4FA8'};
const CE=[['A','B'],['A','F'],['F','E'],['A','E'],['E','D'],['C','D'],['B','D'],['F','C']];
function cluster(cx,cy,r,t){let s='';const nr=r*.19;
  CE.forEach(([a,b])=>{s+=`<line x1="${f1(cx+CL[a][0]*r)}" y1="${f1(cy+CL[a][1]*r)}" x2="${f1(cx+CL[b][0]*r)}" y2="${f1(cy+CL[b][1]*r)}" stroke="#6C8FD6" stroke-width="3"/>`});
  Object.keys(CL).forEach((n,i)=>{const X=cx+CL[n][0]*r,Y=cy+CL[n][1]*r+Math.sin(t*2.2+i)*1.5;
    s+=circ(X,Y,nr,CC[n],'stroke="#fff" stroke-width="3"')+T(n,X,Y+nr*.36,nr*1.0,n==='E'?NAVY:'#fff',{w:700,a:'middle',f:'P'})});return s}
function tileCol(d,c){const sp=d-c;return sp>1e-9?[HOTF,NAVY]:(d>=c*.85?[NEARF,NEARS]:[OKF,OKS])}
function tile(x,y,w,h,d,c,o={}){
  const [f,sk]=o.neutral?['#fff',MB]:tileCol(d,c),hot=!o.neutral&&d-c>1e-9;
  let s=rect(x,y,w,h,14,f,`stroke="${sk}" stroke-width="${hot?5:3}" ${hot?'stroke-dasharray="14 8"':''}`);
  if(!o.nolabel){const lbl=f1(d).toFixed(1)+' / '+f1(c).toFixed(1)+(hot&&!o.neutral?`  +${(d-c).toFixed(1)}`:'');
    s+=T(lbl,x+12,y+h-14,o.fs||22,hot?NAVY:'#2A4FA8',{w:700})}
  return s}
function grid(t,x,y,w,h,cap,o={}){
  let s=card(x,y,w,h,'#fff',22);const gx=14,pad=24,tw=(w-2*pad-3*gx)/4,th=(h-2*pad-2*gx)/3;
  for(let r=0;r<3;r++)for(let c=0;c<4;c++){const idx=r*4+c,tx=x+pad+c*(tw+gx),ty=y+pad+r*(th+gx);
    const neutral=o.scan!==undefined&&idx>=o.scan;
    s+=tile(tx,ty,tw,th,DEM[r][c],cap,{neutral,fs:o.fs});
    if(o.scan!==undefined&&Math.floor(o.scan)===idx&&o.scan<12)s+=rect(tx-6,ty-6,tw+12,th+12,18,'none',`stroke="${BLUE}" stroke-width="5"`);
    if(r===2&&c===1&&!neutral&&o.cluster!==false)s+=cluster(tx+tw/2,ty+th/2-14,Math.min(tw,th)*.5,t)}
  return s}
function check(x,y,col=BLUE,r=22){return circ(x,y,r,col)+`<path d="M ${x-r*.45} ${y} L ${x-r*.1} ${y+r*.38} L ${x+r*.5} ${y-r*.32}" fill="none" stroke="#fff" stroke-width="${r*.22}" stroke-linecap="round" stroke-linejoin="round"/>`}
function note(txt,x,y,w,size=32,o={}){const L=wrap(txt,size,400,w-60),h=L.length*size*1.4+44;
  return card(x,y,w,h,o.fill||'#fff',20)+rect(x,y,10,h,5,o.bar||YEL)+L.map((l,i)=>T(l,x+34,y+44+i*size*1.4,size,NAVY)).join('')}
function hl(parts,x,y,size,w=400){ // parts: [text,color,bold]
  let s='',cx=x;parts.forEach(([tx,col,b])=>{s+=T(tx,cx,y,size,col||NAVY,{w:b?700:w});cx+=meas(tx,size,b?700:w)});return s}

/* ============ scenes ============ */
const SC=[];
// 0 title
SC[0]=(t,l)=>{let s='';
  s+=FU(l,.1,rect(100,170,330,50,25,BLUE)+T('Congestion · Lesson 3',265,205,25,'#fff',{w:700,a:'middle',f:'P'}));
  s+=FU(l,.3,T('Supply',100,370,150,NAVY,{w:700,f:'P'}));
  s+=FU(l,.6,T('and load',100,530,150,BLUE,{w:700,f:'P'})+rect(104,552,480,12,6,YEL));
  s+=FU(l,1.2,note('Is there enough room for all the wires on the chip?',100,620,840,34));
  s+=FU(l,.5,grid(t,1000,170,820,600,2.0,{fs:24}));
  s+=FU(l,5.7,T('city = chip   ·   car = wire   ·   block = tile',1410,820,26,GREY,{w:700,a:'middle'}));
  return s};
// 1 road
function car(x,y,col,lab,sh=0){return `<g transform="translate(${f1(x+sh)} ${f1(y)})">`+rect(0,0,150,58,16,col,`stroke="${NAVY}" stroke-width="3"`)+rect(92,8,40,42,8,'#fff','opacity=".85"')+circ(26,60,11,NAVY)+circ(112,60,11,NAVY)+T(lab,40,38,26,col===YEL?NAVY:'#fff',{w:700,a:'middle',f:'P'})+'</g>'}
SC[1]=(t,l)=>{let s='';
  const X=110,Y=230,W=720,H=420;
  s+=card(X,Y,W,H,'#EEF3FB',22);
  s+=rect(X+30,Y+60,W-60,150,10,'#fff')+rect(X+30,Y+220,W-60,150,10,'#fff');
  s+=rect(X+30,Y+60,W-60,150,10,'none',`stroke="${OKS}" stroke-width="3" stroke-dasharray="14 10"`)+rect(X+30,Y+220,W-60,150,10,'none',`stroke="${OKS}" stroke-width="3" stroke-dasharray="14 10"`);
  s+=T('lane 1',X+50,Y+92,24,GREY,{w:700})+T('lane 2',X+50,Y+252,24,GREY,{w:700});
  s+=T('one GCell (a city block)',X+W/2,Y-18,26,NAVY,{w:700,a:'middle'});
  const lane1=Y+110,lane2=Y+270,sx=X-190;
  const pos=(k,t0,ty)=>{const u=eo((l-t0)/1.6);return [lerp(sx,X+280,u),ty]};
  if(l>=1)s+=car(...pos(1,1,lane1),BLUE,'1');
  if(l>=4)s+=car(...pos(2,4,lane2),'#3B7BF2','2');
  if(l>=7){const u=eo((l-7)/1.2),bump=l>8.2?Math.sin((l-8.2)*14)*Math.max(0,1-(l-8.2)/1.2)*10:0;
    s+=car(lerp(sx,X+W-230,u)+bump,Y+H+40+0,YEL,'3');
    if(l>8.4)s+=T('no lane!',X+W-155,Y+H+30,28,'#B88700',{w:700,a:'middle'})}
  // counters
  const D=l<4?(l>=1?1:0):(l<7?2:3),SP=D-2,CX=1000;
  s+=card(CX,230,820,420,'#fff',22);
  s+=T('capacity  = lanes',CX+50,310,38,NAVY,{w:700})+T('2',CX+770,310,52,BLUE,{w:700,a:'end',f:'P'});
  s+=T('demand  = cars',CX+50,400,38,NAVY,{w:700})+T(String(D),CX+770,400,52,D>2?'#B88700':BLUE,{w:700,a:'end',f:'P'});
  s+=`<line x1="${CX+50}" y1="430" x2="${CX+770}" y2="430" stroke="${MB}" stroke-width="3"/>`;
  s+=T('surplus = demand − capacity',CX+50,490,32,GREY,{w:700});
  const col=SP>0?'#B88700':BLUE;
  s+=T(`${D} − 2 = ${SP>0?'+':''}${SP}`,CX+50,575,64,col,{w:700,f:'P'});
  const lab=SP>0?'JAM · oversubscribed':SP===0?'FULL · still OK':'ROOM LEFT';
  s+=rect(CX+470,528,300,60,30,SP>0?YEL:(SP===0?NEARF:OKF),`stroke="${SP>0?NAVY:OKS}" stroke-width="3"`)+T(lab,CX+620,568,24,NAVY,{w:700,a:'middle'});
  return s+FU(l,12,note('Positive surplus = more wires than the tile can hold.',1000,690,820,30))};
// 2 GCell
SC[2]=(t,l)=>{let s='';
  const k=l<5?l*1.4:99;
  s+=FU(l,.2,grid(t,80,170,980,620,2.0,{fs:26}));
  s+=FU(l,1,note('A chip is cut into a grid of small tiles. Each tile is a GCell.',1120,170,740,32));
  s+=FU(l,3,note('Every tile shows  demand / capacity.',1120,360,740,32,{bar:BLUE}));
  if(l>6){const u=eo((l-6)/.6);
    s+=`<g opacity="${u}">`+card(1120,500,740,250,YELBG,20,`stroke="${YEL}" stroke-width="4"`);
    s+=T('Bottom tile',1160,560,32,NAVY,{w:700})+hl([['demand ',NAVY],['3.5',BLUE,1],['  >  capacity ',NAVY],['2.0',BLUE,1]],1160,615,34);
    s+=T('surplus = 3.5 − 2.0 = +1.5',1160,675,34,'#B88700',{w:700})+T('→ oversubscribed',1160,720,30,NAVY)+'</g>';
    s+=`<path d="M 1115 640 C 1090 640 1060 690 1010 700" fill="none" stroke="${NAVY}" stroke-width="5" stroke-dasharray="10 8" opacity="${u}"/>`}
  return s};
// 3 buckets
function bucket(x,y,w,h,d,lab,sp,status,fillc,lt){
  const capY=y+h*(1-2/3.2),lvl=Math.min(1,d/3.2)*eo(lt);let s='';
  const wy=y+h*(1-lvl*1);
  s+=rect(x,y,w,h,14,'#fff',`stroke="${NAVY}" stroke-width="5"`);
  // water: blue up to cap line, yellow above
  const blueTop=Math.max(wy,capY);
  s+=rect(x+5,blueTop,w-10,y+h-blueTop-4,6,'#8FB5F7');
  if(wy<capY)s+=rect(x+5,wy,w-10,capY-wy,0,YEL);
  s+=`<line x1="${x-14}" y1="${f1(capY)}" x2="${x+w+14}" y2="${f1(capY)}" stroke="${NAVY}" stroke-width="4" stroke-dasharray="12 8"/>`+T('cap = 2.0',x+w+22,capY+8,22,NAVY,{w:700});
  if(d>2&&lt>.8){const u=eo((lt-.8)/.5);s+=`<g opacity="${u}">`+[0,1,2].map(i=>circ(x+w*(.25+i*.25),y-14-((t_ => (t_*30+i*20)%26)(lt*1)),7,YEL)).join('')+'</g>'}
  s+=T('demand '+d.toFixed(1),x+w/2,y+h+50,34,NAVY,{w:700,a:'middle'});
  s+=T('surplus '+sp,x+w/2,y+h+92,32,GREY,{w:700,a:'middle'});
  s+=rect(x+w/2-130,y+h+112,260,52,26,fillc,`stroke="${NAVY}" stroke-width="3"`)+T(status,x+w/2,y+h+148,24,NAVY,{w:700,a:'middle'});
  return s}
SC[3]=(t,l)=>{let s='';
  const H=300,Y=210;
  s+=FU(l,.3,bucket(130,Y,230,H,1.0,'','−1.0','HEALTHY',OKF,l-1.5));
  s+=FU(l,5,bucket(540,Y,230,H,2.0,'','0.0','FULL · OK',NEARF,l-5.6));
  s+=FU(l,8,bucket(950,Y,230,H,3.2,'','+1.2','OVERFLOW',HOTF,l-8.6));
  s+=FU(l,11,card(1330,200,540,420,'#fff',22)+T('The rule',1370,265,34,GREY,{w:700})+T('surplus',1370,345,48,NAVY,{w:700,f:'P'})+T('= demand',1370,405,48,BLUE,{w:700,f:'P'})+T('− capacity',1370,465,48,BLUE,{w:700,f:'P'})+rect(1370,500,460,5,2,MB)+T('≤ 0  safe      > 0  overflow',1370,560,30,NAVY,{w:700}));
  return s};
// 4 scan
SC[4]=(t,l)=>{let s='';
  const sc=clamp((l-3)/8)*12;
  s+=grid(t,80,170,1000,620,2.0,{scan:sc,fs:26});
  const found=sc>=10?1:0;
  s+=FU(l,1,note('Visit every tile. Work out  demand − capacity.',1140,170,720,32));
  s+=card(1140,350,720,220,'#fff',22)+T('oversubscribed tiles',1180,415,32,GREY,{w:700})+T(String(found),1180,530,110,found?'#B88700':BLUE,{w:700,f:'P'})+T(found?'out of 12':'so far…',1330,525,32,NAVY,{w:700});
  if(l>11){const u=eo((l-11)/.6);s+=`<g opacity="${u}">`+card(1140,600,720,170,YELBG,20,`stroke="${YEL}" stroke-width="4"`)+T('Hot tile: 3.5 − 2.0 = +1.5',1180,670,34,NAVY,{w:700})+T('All others have surplus below 0.',1180,722,28,GREY)+'</g>'}
  return s};
// 5 lower cap
SC[5]=(t,l)=>{let s='';
  const cap=lerp(2.0,1.0,ez((l-4)/9));
  let n=0;DEM.flat().forEach(d=>{if(d>cap+1e-9)n++});
  s+=card(80,170,1000,120,'#fff',22)+T('Cap = '+cap.toFixed(2),120,250,56,'#B88700',{w:700,f:'P'});
  const kx=520+(2-cap)*(1-0)*.0,tx0=560,tx1=1030,kp=lerp(tx1,tx0,(cap-1)/1);
  s+=rect(tx0,222,tx1-tx0,16,8,YELBG)+rect(tx0,222,kp-tx0,16,8,YEL)+circ(kp,230,20,'#fff',`stroke="${YEL}" stroke-width="6"`);
  s+=T('1.0',tx0,206,22,GREY)+T('2.0',tx1,206,22,GREY,{a:'end'});
  s+=grid(t,80,310,1000,520,cap,{fs:26});
  s+=FU(l,.5,card(1140,170,720,220,'#fff',22)+T('oversubscribed tiles',1180,235,32,GREY,{w:700})+T(String(n),1180,350,110,n>1?'#B88700':BLUE,{w:700,f:'P'}));
  s+=FU(l,1.5,note('Same wires, same tiles. Only the budget changed.',1140,420,720,32));
  s+=FU(l,13,note('Capacity is part of the contract. Always say which Cap you used.',1140,590,720,30,{bar:BLUE}));
  return s};
// 6 challenge
SC[6]=(t,l)=>{let s='';const V=[1.4,2.0,2.6,3.0],rev=l>=9.7;
  s+=FU(l,.3,note('Capacity = 2.0.  How many tiles are oversubscribed?',100,170,1100,36));
  V.forEach((d,i)=>{const x=100+i*440,y=330,w=400,h=300;
    s+=FU(l,.8+i*.4,(()=>{let g=card(x,y,w,h,'#fff',22);
      const col=rev?tileCol(d,2):[OKF,MB];g+=rect(x+24,y+24,w-48,h-130,14,col[0],`stroke="${col[1]}" stroke-width="${rev&&d>2?5:3}" ${rev&&d>2?'stroke-dasharray="14 8"':''}`);
      g+=T(d.toFixed(1),x+w/2,y+h-70,48,NAVY,{w:700,a:'middle',f:'P'});
      g+=T('demand',x+w/2,y+h-30,24,GREY,{a:'middle'});
      if(rev){const u=eo((l-9.7-i*.25)/.4);g+=`<g opacity="${u}">`+T(d>2?`+${(d-2).toFixed(1)} over`:(d===2?'0.0 · full':`${(d-2).toFixed(1)}`),x+w/2,y+h/2-10,34,d>2?NAVY:'#2A4FA8',{w:700,a:'middle'})+(d>2?'':(d===2?'':''))+'</g>'}
      return g})())});
  if(l>5&&l<9.7){const n=3-Math.floor(l-5.0);const f=(l-5)%1;
    s+=circ(960,780,50,BLUE,'opacity=".15"')+circ(960,780,50-f*8,'none',`stroke="${BLUE}" stroke-width="5"`)+T(String(Math.max(1,Math.min(3,n))),960,800,56,BLUE,{w:700,a:'middle',f:'P'})}
  if(rev)s+=FU(l,10.2,card(560,700,800,120,YELBG,22,`stroke="${YEL}" stroke-width="4"`)+T('Answer: 2 tiles',960,785,56,NAVY,{w:700,a:'middle',f:'P'}));
  if(rev&&l>11.2)s+=T('2.0 is exactly full → not over',1080,670,26,'#B88700',{w:700,a:'middle'});
  return s};
// 7 code
SC[7]=(t,l)=>{let s='';
  const X=80,Y=190,W=1000,H=520;
  s+=rect(X,Y,W,H,22,NAVY)+rect(X,Y,W,64,22,'#16408F')+rect(X,Y+40,W,24,0,'#16408F');
  [0,1,2].forEach(i=>s+=circ(X+40+i*30,Y+32,9,[ '#FF6B6B',YEL,'#4ADE80'][i]));
  s+=T('hot_tiles.py',X+W-40,Y+40,24,'#9DBBF5',{a:'end',w:700,f:'M'});
  const lines=[
   [['surplus',' = ','demand',' - ','cap'],'#fff'],
   [['hot',' = ','[t for t in tiles if surplus(t) > 0]'],'#fff'],
   [['print(','len(hot)',', "oversubscribed tiles")'],'#fff']];
  const code=[
   [['surplus = ','#fff'],['{t: t.demand - cap ','#9DBBF5'],['for ','#FFC400'],['t ','#9DBBF5'],['in ','#FFC400'],['tiles}','#9DBBF5']],
   [['hot = ','#fff'],['[t ','#9DBBF5'],['for ','#FFC400'],['t ','#9DBBF5'],['in ','#FFC400'],['tiles ','#9DBBF5'],['if ','#FFC400'],['surplus[t] > 0','#fff'],[']','#9DBBF5']],
   [['print(','#fff'],['len(hot)','#FFC400'],[', "oversubscribed")','#9DBBF5']]];
  const act=l<3?-1:Math.min(2,Math.floor((l-3)/3.3));
  code.forEach((ln,i)=>{const y=Y+150+i*130;
    if(i===act)s+=rect(X+20,y-52,W-40,84,14,'#fff','opacity=".12"')+rect(X+20,y-52,8,84,4,YEL);
    let cx=X+56;ln.forEach(([tx,c])=>{s+=T(tx,cx,y,30,c,{w:700,f:'M'});cx+=meas(tx,30,700,'M')})});
  const expl=[['1  Work out the surplus','demand minus capacity, per tile'],['2  Keep the tiles above zero','these are the hot ones'],['3  Count them','that is your overflow number']];
  expl.forEach(([a,b],i)=>{const y=190+i*160,on=i<=act;
    s+=`<g opacity="${on?1:.35}">`+card(1140,y,720,130,i===act?YELBG:'#fff',20,i===act?`stroke="${YEL}" stroke-width="4"`:`stroke="${MB}" stroke-width="3"`)+T(a,1176,y+55,32,NAVY,{w:700})+T(b,1176,y+98,27,GREY)+'</g>'});
  if(l>9)s+=FU(l,9.5,note('> 0 is strict: exactly full (surplus 0) is fine.',80,750,1000,30));
  return s};
// 8 traps
SC[8]=(t,l)=>{let s='';const W=560,Y=190,H=600;
  const cards=[
   [5,'1','Mix up units',()=>{let g=T('3.5 wires?',280,0,0,NAVY);return ''}],
   [5.6,'2','Trust the zero',null],[6.2,'3','Change Cap mid-way',null]];
  // card 1
  s+=FU(l,1,(()=>{const x=80;let g=card(x,Y,W,H,'#fff',22)+rect(x,Y,W,10,5,YEL)+T('1  Mix up units',x+30,Y+70,34,NAVY,{w:700});
    g+=rect(x+60,Y+150,440,70,16,YELBG,`stroke="${YEL}" stroke-width="3"`)+T('demand: 3.5 wires?',x+280,Y+196,28,NAVY,{w:700,a:'middle'});
    g+=T('≠',x+280,Y+270,56,'#B88700',{w:700,a:'middle'});
    g+=rect(x+60,Y+300,440,70,16,OKF,`stroke="${OKS}" stroke-width="3"`)+T('capacity: 2.0 tracks?',x+280,Y+346,28,NAVY,{w:700,a:'middle'});
    if(l>4)g+=`<g opacity="${eo((l-4)/.5)}">`+check(x+60,Y+450,BLUE)+T('Write the units',x+100,Y+460,28,NAVY,{w:700})+T('(wires vs wires)',x+100,Y+498,26,GREY)+'</g>';return g})());
  s+=FU(l,2,(()=>{const x=680;let g=card(x,Y,W,H,'#fff',22)+rect(x,Y,W,10,5,YEL)+T('2  Trust the zero',x+30,Y+70,34,NAVY,{w:700});
    const m=[[1.6,2.6,1.4],[2.4,0.0,2.2],[1.8,3.0,1.5]],ts=110,ox=x+(W-3*ts-20)/2,oy=Y+120;
    for(let r=0;r<3;r++)for(let c=0;c<3;c++){const d=m[r][c],hot=d>1.9?true:false,f=hot?HOTF:OKF;
      g+=rect(ox+c*(ts+10),oy+r*(ts+10),ts,ts,12,f,`stroke="${hot?NAVY:OKS}" stroke-width="${hot?4:3}" ${hot?'stroke-dasharray="10 6"':''}`)+T(d.toFixed(1),ox+c*(ts+10)+ts/2,oy+r*(ts+10)+ts/2+10,30,NAVY,{w:700,a:'middle'})}
    if(l>4.6)g+=`<g opacity="${eo((l-4.6)/.5)}">`+check(x+60,Y+530,BLUE)+T('0.0 can sit inside a hot area.',x+100,Y+540,26,NAVY,{w:700})+'</g>';return g})());
  s+=FU(l,3,(()=>{const x=1280;let g=card(x,Y,W,H,'#fff',22)+rect(x,Y,W,10,5,YEL)+T('3  Change Cap mid-way',x+30,Y+70,32,NAVY,{w:700});
    g+=rect(x+50,Y+130,460,76,16,YELBG,`stroke="${YEL}" stroke-width="3"`)+T('Cap  2.0  →  1.0',x+280,Y+182,32,NAVY,{w:700,a:'middle'});
    g+=T('▼',x+280,Y+262,40,BLUE,{a:'middle'});
    g+=rect(x+50,Y+290,460,76,16,OKF,`stroke="${OKS}" stroke-width="3"`)+T('Reset starter placement',x+280,Y+342,28,NAVY,{w:700,a:'middle'});
    if(l>5.2)g+=`<g opacity="${eo((l-5.2)/.5)}">`+check(x+60,Y+450,BLUE)+T('Then compare fairly',x+100,Y+460,28,NAVY,{w:700})+'</g>';return g})());
  return s};
// 9 recap
SC[9]=(t,l)=>{let s='';
  const R=[['surplus = demand − capacity','Positive means overflow.'],['List the hot tiles first','Do not trust a heat map alone.'],['Capacity is a knob','Lower Cap → more jams. Say which one you used.']];
  R.forEach(([a,b],i)=>{s+=FU(l,.4+i*.7,card(100,190+i*140,1100,116,'#fff',22)+check(160,248+i*140,BLUE,26)+T(a,210,240+i*140,36,NAVY,{w:700})+T(b,210,282+i*140,27,GREY))});
  s+=FU(l,3.2,card(100,640,1100,150,YELBG,22,`stroke="${YEL}" stroke-width="4"`)+T('Up next',140,700,26,'#B88700',{w:700})+T('RUDY — the quick demand estimator',140,752,42,NAVY,{w:700,f:'P'}));
  return s};

function frame(t){
  const i=sidx(t),l=t-SL[i].s;
  let s=DEFS+chrome(t,i);
  const fade=clamp(l/.35);
  s+=`<g opacity="${fade}">`+SC[i](t,l)+'</g>';
  const mood=(BUB.filter(b=>t>=b[0]).pop()||[0,0,'h'])[2];
  s+=bubble(t)+pip(t,mood,1740,985,.95)+(window.NOCAP?"":caption(t));
  document.getElementById('s').innerHTML=s;
}
</script></body></html>
