const year=document.getElementById('year');if(year){year.textContent=new Date().getFullYear();}

function setActiveNavLink(){
  var path=window.location.pathname.replace(/\\/g,'/');
  var file=path.split('/').pop()||'index.html';
  var hash=window.location.hash;
  var isHome=!file||file==='index.html'||file===''||path.endsWith('/Portfolio/')||path.endsWith('/Portfolio');
  document.querySelectorAll('.island-links a, .nav a').forEach(function(link){
    link.classList.remove('is-active');
    var href=link.getAttribute('href')||'';
    if(href.indexOf('calendly.com')!==-1){return;}
    if(href.indexOf('articles.html')!==-1&&(file==='articles.html'||path.indexOf('/articles/')!==-1)){
      link.classList.add('is-active');
    }else if(isHome&&hash&&href===hash){
      link.classList.add('is-active');
    }
  });
}
setActiveNavLink();
window.addEventListener('hashchange',setActiveNavLink);

if(document.getElementById('top')){
  var sections=document.querySelectorAll('main section[id]');
  if(sections.length&&'IntersectionObserver' in window){
    var sectionObserver=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          var id='#'+entry.target.id;
          document.querySelectorAll('.island-links a[href="'+id+'"], .nav a[href="'+id+'"]').forEach(function(link){
            document.querySelectorAll('.island-links a, .nav a').forEach(function(item){
              if((item.getAttribute('href')||'').charAt(0)==='#'){item.classList.remove('is-active');}
            });
            link.classList.add('is-active');
          });
        }
      });
    },{threshold:.45,rootMargin:'-30% 0px -45% 0px'});
    sections.forEach(function(section){sectionObserver.observe(section);});
  }
}

const observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
document.querySelectorAll('.reveal,.reveal-blur,.reveal-slide').forEach(function(el){observer.observe(el);});
const glow=document.querySelector('.cursor-glow');
if(glow){window.addEventListener('mousemove',function(e){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';});}

const contactForm=document.getElementById('contact-form');
const glassForm=document.querySelector('.glass-form');
const formSuccess=document.querySelector('.form-success');
const formReset=document.querySelector('.form-reset');
const submitBtn=contactForm?contactForm.querySelector('.form-submit'):null;

if(contactForm&&glassForm&&formSuccess&&submitBtn){
  contactForm.addEventListener('submit',async function(e){
    e.preventDefault();
    if(!contactForm.checkValidity()){
      contactForm.reportValidity();
      return;
    }
    submitBtn.classList.add('is-loading');
    const payload=Object.fromEntries(new FormData(contactForm).entries());
    payload._subject='New portfolio inquiry from '+(payload.name||'Website visitor');
    try{
      const response=await fetch('https://formsubmit.co/ajax/ahmed.filmit@gmail.com',{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload)
      });
      if(!response.ok){throw new Error('Request failed');}
      glassForm.classList.add('is-success');
      formSuccess.hidden=false;
      contactForm.reset();
    }catch(err){
      alert('Something went wrong while sending your message. Please email ahmed.filmit@gmail.com directly.');
    }finally{
      submitBtn.classList.remove('is-loading');
    }
  });
}

if(formReset&&contactForm&&glassForm&&formSuccess){
  formReset.addEventListener('click',function(){
    glassForm.classList.remove('is-success');
    formSuccess.hidden=true;
  });
}

function animateStatNumber(el,duration){
  var target=parseInt(el.getAttribute('data-target'),10);
  var suffix=el.getAttribute('data-suffix')||'';
  if(isNaN(target)){return;}
  var start=0;
  var startTime=null;
  function frame(timestamp){
    if(!startTime){startTime=timestamp;}
    var progress=Math.min((timestamp-startTime)/duration,1);
    var eased=1-Math.pow(1-progress,3);
    var value=Math.round(start+(target-start)*eased);
    el.textContent=value+suffix;
    if(progress<1){requestAnimationFrame(frame);}
  }
  requestAnimationFrame(frame);
}

document.querySelectorAll('.stat-number').forEach(function(el){
  var stat=el.closest('.stat');
  if(!stat){return;}
  var counted=false;
  var statObserver=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting&&!counted){
        counted=true;
        animateStatNumber(el,1600);
        statObserver.unobserve(stat);
      }
    });
  },{threshold:.35});
  statObserver.observe(stat);
});

document.querySelectorAll('.stat-tilt').forEach(function(card){
  card.addEventListener('mousemove',function(e){
    var rect=card.getBoundingClientRect();
    var x=(e.clientX-rect.left)/rect.width-.5;
    var y=(e.clientY-rect.top)/rect.height-.5;
    card.style.transform='perspective(700px) rotateY('+x*10+'deg) rotateX('+(-y*10)+'deg) translateY(-8px)';
  });
  card.addEventListener('mouseleave',function(){
    card.style.transform='';
  });
});
