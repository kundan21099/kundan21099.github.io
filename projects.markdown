---
layout: default
title: Projects
permalink: /projects/
---

<!--- Auto fetch from Gihub --->
<!---
<div class="project-grid">
  {% for repo in site.github.public_repositories %}
  <div class="project-card">  
    <h3><a href="{{ repo.html_url }}" target="_blank">{{ forloop.index }}. {{ repo.name }}</a></h3>
    <p>{{ repo.description }}</p>
    <p>💻 {{ repo.language }} </p>
  </div>
  {% endfor %}
</div>
--->

<!--- Get From yml list --->
<div class="project-grid">
  {% for project in site.data.project_list %}
  <div class="project-card">
    <h3><a href="{{ project.url }}">{{forloop.index}}. {{ project.title }}</a></h3>
    <p>{{ project.description }}</p>
    <p>💻 {{ project.languages | join: ", " }} | 🛠️ {{ project.tools | join: ", " }} | 🔌{{ project.protocols | join: ", " }} </p>
  </div>
  {% endfor %}
</div>

