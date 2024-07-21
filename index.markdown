---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---
 
# Welcome to my site! 

---

I am just some person who likes [Scratch](https://scratch.mit.edu/) and [LaTeX](https://www.latex-project.org/). I write extensions for both [Firefox](https://addons.mozilla.org/en-US/firefox/user/17603989/) and [Chrome](https://chrome.google.com/webstore/search/lastlegume), [tools](/scioly-tools) for [Science Olympiad (Scioly)](https://www.soinc.org/) Tournaments, and am an infrequent game jam participant on itch.io.   

# Blog Posts

--- 

<ul>
  {% for post in site.posts %}
    <li>
      {{ post.date | date: "%B %d, %Y"}}: <a href="{{ post.url }}"> {{ post.title }}</a>
    </li>
  {% endfor %}
</ul>