// Site interactions: nav state, mobile menu, scroll reveals, count-ups, hero scroll fade.
(function(){
  var d=document, root=d.documentElement;
  root.classList.add('js');
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav: solid once you scroll past the top; mobile menu toggle
  var nav=d.querySelector('.nav');
  function onScroll(){ if(nav) nav.classList.toggle('scrolled', window.scrollY>24); }
  onScroll(); window.addEventListener('scroll',onScroll,{passive:true});
  var btn=d.querySelector('.menu');
  if(btn){ btn.addEventListener('click',function(){ var o=nav.classList.toggle('open'); btn.setAttribute('aria-expanded',o); });
    nav.querySelectorAll('.links a').forEach(function(a){ a.addEventListener('click',function(){ nav.classList.remove('open'); btn.setAttribute('aria-expanded',false); }); }); }

  // Auto-tag content on inner pages so they animate without extra markup
  d.querySelectorAll('main.wrap > h2, main.wrap > p, main.wrap > ul, main.wrap > ol, main.wrap > .figs, main.wrap > figure, main.wrap > table, main.wrap > .grid, main.wrap > .note, main.wrap > iframe, main.wrap > .facts').forEach(function(el){
    if(!el.classList.contains('reveal')) el.classList.add('reveal');
  });
  // Stagger siblings inside grids
  d.querySelectorAll('.grid, .covers, .facts, .stats').forEach(function(g){
    Array.prototype.forEach.call(g.children,function(c,i){ c.classList.add('reveal'); c.style.setProperty('--d',(i*0.09)+'s'); });
  });

  var els=d.querySelectorAll('.reveal');
  if(reduce||!('IntersectionObserver' in window)){ els.forEach(function(e){e.classList.add('in');}); }
  else{
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); count(en.target); } });
    },{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(e){ io.observe(e); });
    // anything already on screen at load
    requestAnimationFrame(function(){ els.forEach(function(e){ var r=e.getBoundingClientRect(); if(r.top<innerHeight*0.94){ e.classList.add('in'); io.unobserve(e); count(e);} }); });
  }

  // Count-up for [data-count] numbers
  function count(scope){
    var nodes=scope.matches&&scope.matches('[data-count]')?[scope]:scope.querySelectorAll?scope.querySelectorAll('[data-count]'):[];
    Array.prototype.forEach.call(nodes,function(n){
      if(n.dataset.done) return; n.dataset.done=1;
      var end=parseFloat(n.dataset.count), pre=n.dataset.pre||'', suf=n.dataset.suf||'';
      if(reduce){ n.textContent=pre+end.toLocaleString()+suf; return; }
      var t0=null, dur=1400;
      function step(t){ if(!t0)t0=t; var p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3);
        n.textContent=pre+Math.round(end*e).toLocaleString()+suf; if(p<1) requestAnimationFrame(step); }
      requestAnimationFrame(step);
    });
  }

  // Hero: content drifts up and fades as you scroll away (Apple-style)
  var hero=d.querySelector('.hero-inner');
  if(hero&&!reduce){
    var ticking=false;
    window.addEventListener('scroll',function(){
      if(ticking) return; ticking=true;
      requestAnimationFrame(function(){
        var y=Math.min(window.scrollY, innerHeight), p=y/innerHeight;
        hero.style.transform='translateY('+(y*0.25)+'px) scale('+(1-p*0.05)+')';
        hero.style.opacity=String(Math.max(0,1-p*1.4));
        ticking=false;
      });
    },{passive:true});
  }
})();
