---
layout: default
title: Blog
permalink: /blog/
header: true
---

# Blog

---

<ul>
  {% for post in site.posts %}
    <li>
      {{ post.date | date: "%B %d, %Y"}}: <a href="{{ post.url }}"> {{ post.title }}</a>
    </li>
  {% endfor %}
</ul>

