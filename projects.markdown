---
layout: default
title: Projects
permalink: /projects/
---

<!--- added sorting--->

<div class="project-sort">
  <label for="sortSelect">Sort projects by:</label>
  <select id="sortSelect">
    <option value="">Default</option>
    <option value="year">Year</option>
    <option value="language">Language</option>
    <option value="category">Category</option>
    <option value="protocol">Protocol</option>
    <option value="status">Status</option>
  </select>
</div>



<div class="project-grid" id="projectGrid">
  {% for project in site.data.project_list %}
  <div class="project-card"
       data-language="{{ project.sort_primary_language }}"
       data-year="{{ project.sort_year }}"
       data-category="{{ project.sort_category }}"
       data-protocol="{{ project.sort_protocols }}"
       data-status="{{ project.sort_status }}">

    <h3>
      <span class="project-number"></span>
      <a href="{{ project.url }}">{{ project.title }}</a>
    </h3>


    <p>{{ project.description }}</p>

    <p class="project-meta">
      {% if project.languages and project.languages.size > 0 and project.languages != "NA" %}
        💻 {{ project.languages | join: ", " }}
      {% endif %}
      {% if project.tools and project.tools.size > 0 and project.tools != "NA" %}
        | 🛠️ {{ project.tools | join: ", " }}
      {% endif %}
      {% if project.protocols and project.protocols.size > 0 and project.protocols != "NA" %}
        | 🔌 {{ project.protocols | join: ", " }}
      {% endif %}
    </p>

  </div>
  {% endfor %}
</div>

