---
to: apps/blog/site/posts/<%= h.getYear %>/<%= h.getDate() %>-<%= h.changeCase.param(title) %>.md
---

---
pageTitle: <%= title %>
description: "<%- description || '' %>"
imageUrl: "<%- imageUrl || '' %>"
date: <%= h.getDate() %>
contentTags: ["<%- tags.join('\", \"') %>"]
draft: true
---

Post has been generated automatically




