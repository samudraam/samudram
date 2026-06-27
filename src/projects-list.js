import projectsData from "./data/projects.json";
import { initTheme } from "./apply-theme.js";

/** @type {string} */
let activeCategory = "All";

/**
 * Returns the filtered project list for the active category.
 * @param {typeof projectsData.projects} projects
 * @returns {typeof projectsData.projects}
 */
const getFilteredProjects = (projects) => {
  if (activeCategory === "All") {
    return projects;
  }

  return projects.filter((project) => project.category === activeCategory);
};

/**
 * Builds the HTML for a single project list entry.
 * @param {typeof projectsData.projects[number]} project
 * @returns {string}
 */
const createProjectEntryHtml = (project) => {
  const statusClass =
    project.status === "WIP" ? " project-entry__status--wip" : "";
  const tagsHtml = project.tags
    .map((tag) => `<li>${tag}</li>`)
    .join("");

  return `
    <li class="project-entry">
      <a
        class="project-entry__link"
        href="project.html?slug=${project.slug}"
        aria-label="View ${project.title} project details"
      >
        <div class="project-entry__meta">
          <span class="project-entry__date">${project.date}</span>
          <span class="project-entry__status${statusClass}">${project.status}</span>
        </div>
        <div class="project-entry__body">
          <span class="project-entry__category">${project.category}</span>
          <h2 class="project-entry__title">${project.title}</h2>
          <p class="project-entry__desc">${project.description}</p>
          <ul class="project-entry__tags">${tagsHtml}</ul>
        </div>
        <div class="project-entry__indicator" aria-hidden="true">
          <span class="project-entry__indicator-icon"></span>
          <span class="project-entry__indicator-count">${project.mediaCount}</span>
        </div>
      </a>
    </li>
  `;
};

/**
 * Renders filter buttons and wires click handlers.
 * @param {HTMLElement} container
 * @param {() => void} onFilterChange
 */
const renderFilters = (container, onFilterChange) => {
  container.innerHTML = projectsData.categories
    .map(
      (category) => `
        <button
          type="button"
          class="filter-btn${category === activeCategory ? " is-active" : ""}"
          data-category="${category}"
          aria-pressed="${category === activeCategory}"
        >
          ${category}
        </button>
      `
    )
    .join("");

  container.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");

      if (!category || category === activeCategory) {
        return;
      }

      activeCategory = category;
      onFilterChange();
    });
  });
};

/**
 * Renders the project list based on the active filter.
 * @param {HTMLElement} listEl
 */
const renderProjectList = (listEl) => {
  const filtered = getFilteredProjects(projectsData.projects);

  if (filtered.length === 0) {
    listEl.innerHTML =
      '<li class="project-list__empty">No entries match this filter.</li>';
    return;
  }

  listEl.innerHTML = filtered.map(createProjectEntryHtml).join("");
};

/**
 * Initializes the field-log projects archive page.
 */
const initProjectsList = () => {
  initTheme(
    projectsData.themes,
    projectsData.defaultTheme,
    projectsData.defaultTheme
  );

  const countEl = document.getElementById("archive-count");
  const filterBar = document.getElementById("filter-bar");
  const projectList = document.getElementById("project-list");

  if (!(filterBar instanceof HTMLElement) || !(projectList instanceof HTMLElement)) {
    return;
  }

  const total = projectsData.projects.length;

  if (countEl instanceof HTMLElement) {
    countEl.textContent = `${total} entries logged`;
  }

  const handleFilterChange = () => {
    renderFilters(filterBar, handleFilterChange);
    renderProjectList(projectList);
  };

  handleFilterChange();
};

document.addEventListener("DOMContentLoaded", initProjectsList);
