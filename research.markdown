---
layout: default
title: Research Papers
permalink: /research/
---

<div class="paper-grid">
  {% assign papers = site.research | sort: "year" | reverse %}
  {% for paper in papers %}
  <div class="paper-card">
    <h3>{{ paper.title }}</h3>
    <p>{{ paper.venue }} | {{ paper.year }} | {{ paper.publisher }}</p>
    <p>{{ paper.abstract | truncate: 250 }}</p>
    <a href="{{ paper.link }}" target="_blank" rel="nofollow">View Publication</a>
  </div>
  {% endfor %}
</div>
