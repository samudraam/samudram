import{a as c,b as o}from"./curtains-XgKsR866.js";import"./page-transitions-B08BrUxd.js";import{i as l,p as r}from"./apply-theme-Ce-kM_Nc.js";let a="All";const d=t=>a==="All"?t:t.filter(n=>n.category===a),p=t=>{const n=t.status==="WIP"?" project-entry__status--wip":"",e=t.tags.map(s=>`<li>${s}</li>`).join("");return`
    <li class="project-entry">
      <a
        class="project-entry__link"
        href="project.html?slug=${t.slug}"
        aria-label="View ${t.title} project details"
      >
        <div class="project-entry__meta">
          <span class="project-entry__date">${t.date}</span>
          <span class="project-entry__status${n}">${t.status}</span>
        </div>
        <div class="project-entry__body">
          <span class="project-entry__category">${t.category}</span>
          <h2 class="project-entry__title">${t.title}</h2>
          <p class="project-entry__desc">${t.description}</p>
          <ul class="project-entry__tags">${e}</ul>
        </div>
        <div class="project-entry__indicator" aria-hidden="true">
          <span class="project-entry__indicator-icon"></span>
          <span class="project-entry__indicator-count">${t.mediaCount}</span>
        </div>
      </a>
    </li>
  `},u=(t,n)=>{t.innerHTML=r.categories.map(e=>`
        <button
          type="button"
          class="filter-btn${e===a?" is-active":""}"
          data-category="${e}"
          aria-pressed="${e===a}"
        >
          ${e}
        </button>
      `).join(""),t.querySelectorAll(".filter-btn").forEach(e=>{e.addEventListener("click",()=>{const s=e.getAttribute("data-category");!s||s===a||(a=s,n())})})},y=t=>{const n=d(r.projects);if(n.length===0){t.innerHTML='<li class="project-list__empty">No entries match this filter.</li>';return}t.innerHTML=n.map(p).join(""),c(t.querySelectorAll(".project-entry"),{opacity:[0,1],y:[24,0]},{duration:.45,delay:o(.4),easing:"ease-in"})},m=()=>{l(r.themes,r.defaultTheme,r.defaultTheme);const t=document.getElementById("archive-count"),n=document.getElementById("filter-bar"),e=document.getElementById("project-list");if(!(n instanceof HTMLElement)||!(e instanceof HTMLElement))return;const s=r.projects.length;t instanceof HTMLElement&&(t.textContent=`${s} entries logged`);const i=()=>{u(n,i),y(e)};i()};document.addEventListener("DOMContentLoaded",m);
