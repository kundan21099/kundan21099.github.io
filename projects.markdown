---
layout: default
title: Projects
permalink: /projects/
---

<div class="project-grid">
  {% for repo in site.github.public_repositories %}
  <div class="project-card">
    <h3><a href="{{ repo.html_url }}" target="_blank">{{ repo.name }}</a></h3>
    <p>{{ repo.description }}</p>
    <p>💻 {{ repo.language }} </p>
  </div>
  {% endfor %}
</div>