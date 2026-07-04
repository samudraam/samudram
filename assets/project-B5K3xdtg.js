import"./loader-C5IFBMMi.js";import{p as g,i as y}from"./apply-theme-DLVN4_KM.js";let l=null,c=0,i=[],p=null,h=!1;const d=()=>(l instanceof HTMLElement||(l=document.createElement("div"),l.className="gallery-lightbox",l.id="gallery-lightbox",l.setAttribute("role","dialog"),l.setAttribute("aria-modal","true"),l.setAttribute("aria-label","Image gallery"),l.setAttribute("aria-hidden","true"),l.hidden=!0,l.innerHTML=`
    <div class="gallery-lightbox__backdrop" data-action="close"></div>
    <div class="gallery-lightbox__panel glass-surface">
      <button
        type="button"
        class="gallery-lightbox__close glass-surface"
        data-action="close"
        aria-label="Close gallery"
      >
        <span aria-hidden="true">×</span>
      </button>
      <button
        type="button"
        class="gallery-lightbox__nav gallery-lightbox__nav--prev glass-surface"
        data-action="prev"
        aria-label="Previous image"
      >
        <span aria-hidden="true">←</span>
      </button>
      <figure class="gallery-lightbox__figure">
        <img class="gallery-lightbox__img" src="" alt="" />
        <figcaption class="gallery-lightbox__caption"></figcaption>
      </figure>
      <button
        type="button"
        class="gallery-lightbox__nav gallery-lightbox__nav--next glass-surface"
        data-action="next"
        aria-label="Next image"
      >
        <span aria-hidden="true">→</span>
      </button>
      <p class="gallery-lightbox__counter glass-surface" aria-live="polite"></p>
    </div>
  `,document.body.appendChild(l),l.addEventListener("click",L)),l),b=()=>{const e=d(),t=i[c];if(!t)return;const a=e.querySelector(".gallery-lightbox__img"),n=e.querySelector(".gallery-lightbox__caption"),u=e.querySelector(".gallery-lightbox__counter"),s=e.querySelector('[data-action="prev"]'),r=e.querySelector('[data-action="next"]');if(!(a instanceof HTMLImageElement))return;a.src=t.src,a.alt=t.alt??"",n instanceof HTMLElement&&(n.textContent=t.caption??"",n.hidden=!t.caption),u instanceof HTMLElement&&(u.textContent=`${c+1} / ${i.length}`);const o=i.length>1;s instanceof HTMLButtonElement&&(s.hidden=!o),r instanceof HTMLButtonElement&&(r.hidden=!o)},x=e=>{if(!i.length)return;c=e,b();const t=d();t.hidden=!1,t.setAttribute("aria-hidden","false"),t.classList.add("is-open"),document.body.classList.add("gallery-lightbox-open");const a=t.querySelector(".gallery-lightbox__close");a instanceof HTMLElement&&a.focus()},_=()=>{const e=d();e.hidden=!0,e.setAttribute("aria-hidden","true"),e.classList.remove("is-open"),document.body.classList.remove("gallery-lightbox-open"),p instanceof HTMLElement&&(p.focus(),p=null)},f=e=>{i.length<=1||(c=(c+e+i.length)%i.length,b())},L=e=>{const t=e.target;if(!(t instanceof Element))return;const a=t.closest("[data-action]");if(!(a instanceof HTMLElement))return;const n=a.getAttribute("data-action");if(n==="close"){_();return}if(n==="prev"){f(-1);return}n==="next"&&f(1)},v=e=>{if(!d().hidden){if(e.key==="Escape"){e.preventDefault(),_();return}if(e.key==="ArrowLeft"){e.preventDefault(),f(-1);return}e.key==="ArrowRight"&&(e.preventDefault(),f(1))}},E=(e,t)=>{t!=null&&t.length&&(i=t,d(),h||(document.addEventListener("keydown",v),h=!0),e.querySelectorAll("[data-gallery-index]").forEach(a=>{a.addEventListener("click",()=>{const n=Number(a.getAttribute("data-gallery-index"));Number.isNaN(n)||(p=a instanceof HTMLElement?a:null,x(n))}),a.addEventListener("keydown",n=>{n instanceof KeyboardEvent&&(n.key!=="Enter"&&n.key!==" "||(n.preventDefault(),a.dispatchEvent(new Event("click"))))})}))},$=()=>new URLSearchParams(window.location.search).get("slug"),k=e=>g.projects.find(t=>t.slug===e),j=e=>e!=null&&e.length?`
    <section class="media-section" aria-label="Project videos">
      <p class="media-section__label">Video</p>
      <div class="media-videos">${e.map(a=>`
        <figure class="media-video glass-surface">
          <video
            controls
            muted
            playsinline
            preload="metadata"
            poster="${a.poster||""}"
          >
            <source src="${a.src}" type="video/mp4" />
          </video>
          ${a.caption?`<figcaption class="media-video__caption">${a.caption}</figcaption>`:""}
        </figure>
      `).join("")}</div>
    </section>
  `:"",H=e=>e!=null&&e.length?`
    <section class="media-section" aria-label="Project images">
      <p class="media-section__label">Gallery</p>
      <div class="media-gallery">${e.map((a,n)=>`
        <button
          type="button"
          class="media-image__trigger"
          data-gallery-index="${n}"
          aria-label="View full size: ${a.alt||`Image ${n+1}`}"
        >
          <figure class="media-image glass-surface">
            <img src="${a.src}" alt="${a.alt??""}" loading="lazy" />
            ${a.caption?`<figcaption class="media-image__caption">${a.caption}</figcaption>`:""}
          </figure>
        </button>
      `).join("")}</div>
    </section>
  `:"",T=e=>e!=null&&e.length?`
    <section class="notes-section" aria-label="Project notes">
      <p class="notes-section__label">Field Notes</p>
      ${e.map(a=>`
        <article class="note-block">
          <h2 class="note-block__heading">${a.heading}</h2>
          <p class="note-block__body">${a.body}</p>
        </article>
      `).join("")}
    </section>
  `:"",m=e=>{e.innerHTML=`
    <p class="project-detail__error">
      Entry not found in the archive.
      <a href="projects.html" class="project-detail__back">Return to projects</a>
    </p>
  `,document.title="Not Found — Projects"},M=(e,t)=>{var r;document.title=`${t.title} — Projects`;const a=t.status==="WIP"?" project-detail__status--wip":"",n=t.tags.map(o=>`<li>${o}</li>`).join(""),u=t.externalUrl?`<a
        class="project-detail__external glass-surface"
        href="${t.externalUrl}"
        target="_blank"
        rel="noopener noreferrer"
      >
        View live project
        <span aria-hidden="true">↗</span>
      </a>`:"",s=t.media??{};e.innerHTML=`
    <a href="projects.html" class="project-detail__back">
      <span aria-hidden="true">←</span> Field Log / Archive
    </a>

    <div class="project-detail__meta-row">
      <span class="project-detail__date">${t.date}</span>
      <span class="project-detail__status${a}">${t.status}</span>
      <span class="project-detail__category glass-surface">${t.category}</span>
    </div>

    <h1 class="project-detail__title">${t.title}</h1>
    <p class="project-detail__desc">${t.description}</p>

    <ul class="project-detail__tags">${n}</ul>

    ${u}

    ${j(s.videos)}
    ${H(s.images)}
    ${T(t.notes)}
  `,e.querySelectorAll("video").forEach(o=>{o.addEventListener("loadeddata",()=>{o.classList.add("is-media-ready")})}),(r=s.images)!=null&&r.length&&E(e,s.images)},w=()=>{const e=document.getElementById("project-detail"),t=$();if(!(e instanceof HTMLElement))return;const a=t?k(t):void 0,n=(a==null?void 0:a.theme)??g.defaultTheme;if(y(g.themes,n,g.defaultTheme),!t){m(e);return}if(!a){m(e);return}M(e,a)};document.addEventListener("DOMContentLoaded",w);
