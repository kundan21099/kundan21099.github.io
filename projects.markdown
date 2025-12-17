---
layout: default
title: Projects
permalink: /projects/
---

<!--- added sorting--->
           
<div class="project-sort">
  <div class="dropdown">
    <button class="dropbtn">Sort Projects</button>
    <div class="dropdown-content">
      <a href="#" data-sort="">Default</a>
      <a href="#" data-sort="year">Year</a>
      <a href="#" data-sort="language">Programming Language</a>
      <a href="#" data-sort="category">Category</a>
      <a href="#" data-sort="protocol">Protocol</a>
      <a href="#" data-sort="status">Status</a>
    </div>
  </div>
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

