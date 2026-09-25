// Shared Plotly helpers for the portfolio pages. Palette validated for colour-blind separation.
const C={blue:'#2556a8',bluePale:'#b9c7e3',orange:'#c0622b',teal:'#2a9d8f',ink:'#14213d',ink2:'#3a4a6b',muted:'#6b7280',grid:'#eceef2',line:'#d6d9e0'};
const FONT={family:'"Source Sans 3","Segoe UI",Helvetica,Arial,sans-serif',size:13,color:C.ink2};
const CFG={displayModeBar:false,responsive:true};
function fmtP(p){return p<0.0001?'< 0.0001':p.toFixed(p<0.01?4:3);}
function base(extra){return Object.assign({font:FONT,paper_bgcolor:'rgba(0,0,0,0)',plot_bgcolor:'rgba(0,0,0,0)',
  margin:{l:10,r:20,t:10,b:50},hoverlabel:{bgcolor:'#fff',bordercolor:C.line,font:{family:FONT.family,color:C.ink,size:13}},
  showlegend:false,bargap:0.35},extra||{});}
function ax(title,o){return Object.assign({title:title?{text:title,font:{size:12,color:C.muted}}:undefined,gridcolor:C.grid,zeroline:false,
  linecolor:C.line,tickfont:{color:C.muted,size:12},automargin:true,fixedrange:true},o||{});}
function hbar(id,o){
  const t={type:'bar',orientation:'h',y:o.y,x:o.x,marker:{color:o.color,line:{width:0}},hovertext:o.hover,hoverinfo:'text',
    text:o.text,textposition:o.text?'outside':'none',cliponaxis:false,textfont:{color:C.ink2,size:12}};
  const xo=Object.assign({},o.range?{range:o.range}:{},o.log?{type:'log'}:{},o.zero?{zeroline:true,zerolinecolor:C.muted,zerolinewidth:1}:{});
  const lay=base({xaxis:ax(o.xtitle,xo),yaxis:ax(null,{gridcolor:'rgba(0,0,0,0)',tickfont:{color:C.ink2,size:12.5}})});
  Plotly.newPlot(id,[t],lay,CFG);}
function vbar(id,o){
  const t={type:'bar',x:o.x,y:o.y,marker:{color:o.color,line:{width:0}},hovertext:o.hover,hoverinfo:'text'};
  const lay=base({bargap:o.numeric?0.08:0.3,xaxis:ax(o.xtitle,{gridcolor:'rgba(0,0,0,0)',type:o.numeric?'linear':'category'}),yaxis:ax(o.ytitle)});
  Plotly.newPlot(id,[t],lay,CFG);}
function dots(id,o){
  const lines={type:'scatter',mode:'lines',hoverinfo:'skip',line:{color:C.line,width:2},
    x:o.y.flatMap((_,i)=>[o.ref,o.x[i],null]),y:o.y.flatMap(l=>[l,l,null])};
  const pts={type:'scatter',mode:'markers+text',x:o.x,y:o.y,marker:{size:12,color:C.blue,line:{color:'#fff',width:2}},
    text:o.x.map(v=>v.toFixed(1)),textposition:o.x.map(v=>v<o.ref?'middle left':'middle right'),textfont:{color:C.ink2,size:12},
    hovertext:o.hover,hoverinfo:'text',cliponaxis:false};
  const lay=base({xaxis:ax(o.xtitle,{range:o.range}),yaxis:ax(null,{gridcolor:'rgba(0,0,0,0)',tickfont:{color:C.ink2,size:12.5},autorange:'reversed'}),
    shapes:[{type:'line',x0:o.ref,x1:o.ref,yref:'paper',y0:0,y1:1,line:{color:C.muted,width:1,dash:'dot'}}],
    annotations:[{x:o.ref,yref:'paper',y:1.02,text:'neutral',showarrow:false,font:{size:11,color:C.muted},yanchor:'bottom'}],margin:{l:10,r:30,t:24,b:50}});
  Plotly.newPlot(id,[lines,pts],lay,CFG);}
function scatterMap(id,groups){
  const tr=groups.map(g=>({type:'scattergl',mode:'markers',name:g.name,x:g.x,y:g.y,hovertext:g.hover,hoverinfo:'text',
    marker:{size:5,color:g.color,opacity:0.75,line:{width:0}}}));
  const lay=base({showlegend:true,legend:{orientation:'h',x:0,y:1.08,font:{color:C.ink2,size:12.5}},
    xaxis:ax(null,{showticklabels:false,showgrid:false,linecolor:'rgba(0,0,0,0)'}),
    yaxis:ax(null,{showticklabels:false,showgrid:false,linecolor:'rgba(0,0,0,0)',scaleanchor:'x',scaleratio:1.52}),
    margin:{l:0,r:0,t:30,b:0}});
  Plotly.newPlot(id,tr,lay,CFG);}
function divbar(id,o){ // P&L bars: gains blue, losses orange, value labels on every bar end
  const t={type:'bar',orientation:'h',y:o.y,x:o.x,marker:{color:o.x.map(v=>v>=0?C.blue:C.orange),line:{width:0}},
    hovertext:o.hover,hoverinfo:'text',text:o.text,textposition:'outside',cliponaxis:false,textfont:{color:C.ink2,size:12}};
  const lay=base({bargap:0.3,xaxis:ax(o.xtitle,{zeroline:true,zerolinecolor:C.muted,zerolinewidth:1,range:(document.getElementById(id).clientWidth<600&&o.rangeNarrow)?o.rangeNarrow:o.range,
    tickvals:[-8000,-4000,0,4000],ticktext:['−$8K','−$4K','$0','+$4K']}),
    yaxis:ax(null,{gridcolor:'rgba(0,0,0,0)',tickfont:{color:C.ink2,size:12}})});
  Plotly.newPlot(id,[t],lay,CFG);}
