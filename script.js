const year=document.getElementById('year');if(year){year.textContent=new Date().getFullYear();}
const menu=document.querySelector('.menu-btn');
const mobile=document.querySelector('.mobile-nav');
if(menu&&mobile){menu.addEventListener('click',function(){mobile.classList.toggle('open');});}
const observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){observer.observe(el);});
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
