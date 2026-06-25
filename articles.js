(function () {
  var GITHUB_REPO = 'Ahmed-SMA/Portfolio';
  var COVERS_PATH = 'assets/articles/covers/';

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function getBase() {
    var base = document.body.dataset.base;
    if (base !== undefined && base !== null && base !== '') {
      return base;
    }
    var path = window.location.pathname.replace(/\\/g, '/');
    var repoMatch = path.match(/^(.*\/Portfolio\/)/i);
    if (repoMatch) {
      return repoMatch[1];
    }
    if (path.indexOf('/articles/') !== -1) {
      return '../';
    }
    return '';
  }

  function fetchArticles() {
    var base = getBase();
    return fetch(base + 'data/articles.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Articles failed to load');
        return r.json();
      })
      .then(function (data) {
        return data.articles || [];
      });
  }

  function formatDate(value) {
    if (!value) return '';
    return new Date(value + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function articleUrl(slug) {
    var base = getBase();
    return base + 'articles/' + slug + '.html';
  }

  function coverSrc(cover) {
    var base = getBase();
    return base + cover;
  }

  function githubEditUrl() {
    return 'https://github.com/' + GITHUB_REPO + '/edit/main/data/articles.json';
  }

  function githubUploadUrl() {
    return 'https://github.com/' + GITHUB_REPO + '/upload/main/' + COVERS_PATH;
  }

  function renderArticleCard(article, index) {
    var delay = Math.min(index * 0.08, 0.48);
    return (
      '<article class="article-card reveal" style="transition-delay:' + delay + 's">' +
      '<a class="article-card-link" href="' + articleUrl(article.slug) + '" aria-label="Read ' + article.title + '">' +
      '<div class="article-art"><img src="' + coverSrc(article.cover) + '" alt="" loading="lazy" decoding="async"></div>' +
      '<p>' + article.category + '</p>' +
      '<h3>' + article.title + '</h3>' +
      '<span>' + article.excerpt + '</span>' +
      '<span class="article-card-cta">Read Article →</span>' +
      '</a></article>'
    );
  }

  function renderListingGrid(container, articles) {
    container.innerHTML = articles.map(renderArticleCard).join('');
    initRevealObserver(container);
  }

  function renderPreviewGrid(container, articles, limit) {
    var subset = articles.slice(0, limit || 2);
    container.innerHTML = subset
      .map(function (article, index) {
        return (
          '<article class="article-card reveal" style="transition-delay:' + index * 0.1 + 's">' +
          '<div class="article-art"><img src="' + coverSrc(article.cover) + '" alt="" loading="lazy" decoding="async"></div>' +
          '<p>' + article.category + '</p>' +
          '<h3>' + article.title + '</h3>' +
          '<span>' + article.excerpt + '</span>' +
          '<a href="' + articleUrl(article.slug) + '">Read Article →</a>' +
          '</article>'
        );
      })
      .join('');
    initRevealObserver(container);
  }

  function renderArticlePage(article) {
    document.title = article.title + ' | S.M. Ahmed';
    var meta = $('meta[name="description"]');
    if (meta) meta.setAttribute('content', article.excerpt);

    var cover = $('#article-cover');
    if (cover) {
      cover.src = coverSrc(article.cover);
      cover.alt = article.title + ' cover';
    }

    var category = $('#article-category');
    if (category) category.textContent = article.category;

    var title = $('#article-title');
    if (title) title.textContent = article.title;

    var metaLine = $('#article-meta');
    if (metaLine) {
      metaLine.textContent = formatDate(article.date) + ' · ' + article.readTime;
    }

    var body = $('#article-body');
    if (body) body.innerHTML = article.content;

    document.querySelectorAll('.reveal-blur').forEach(function (el, index) {
      el.style.transitionDelay = Math.min(index * 0.09, 0.45) + 's';
    });

    initRevealObserver(document);
    initReadingProgress();
  }

  function initRevealObserver(root) {
    var nodes = (root || document).querySelectorAll('.reveal:not(.visible),.reveal-blur:not(.visible),.reveal-slide:not(.visible)');
    if (!nodes.length || !('IntersectionObserver' in window)) {
      nodes.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    nodes.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initReadingProgress() {
    var bar = $('.reading-progress');
    if (!bar) return;

    function update() {
      var doc = document.documentElement;
      var scrollTop = doc.scrollTop || document.body.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      var progress = height > 0 ? (scrollTop / height) * 100 : 0;
      bar.style.width = progress + '%';
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  function bindManageCovers() {
    var btn = $('#manage-covers-btn');
    var panel = $('#covers-guide');
    if (!btn || !panel) return;

    btn.addEventListener('click', function () {
      panel.hidden = !panel.hidden;
    });
  }

  function initListingPage() {
    var grid = $('#articles-grid');
    if (!grid) return;

    fetchArticles()
      .then(function (articles) {
        renderListingGrid(grid, articles);
      })
      .catch(function () {
        if (!grid.querySelector('.article-card')) {
          grid.innerHTML =
            '<p class="articles-error">Unable to load articles. Please refresh or visit again shortly.</p>';
        }
      });

    bindManageCovers();
  }

  function initPreviewSection() {
    var grid = $('#home-articles-grid');
    if (!grid) return;

    fetchArticles()
      .then(function (articles) {
        renderPreviewGrid(grid, articles, 2);
      })
      .catch(function () {});
  }

  function initArticlePage() {
    var slug = document.body.dataset.articleSlug;
    if (!slug) return;

    fetchArticles()
      .then(function (articles) {
        var article = articles.find(function (item) {
          return item.slug === slug;
        });
        if (!article) throw new Error('Article not found');
        renderArticlePage(article);
      })
      .catch(function () {
        var body = $('#article-body');
        if (body) {
          body.innerHTML =
            '<p class="articles-error">This article could not be loaded. <a href="../articles.html">Return to all articles</a>.</p>';
        }
      });
  }

  window.ArticlesApp = {
    githubEditUrl: githubEditUrl,
    githubUploadUrl: githubUploadUrl
  };

  document.addEventListener('DOMContentLoaded', function () {
    initListingPage();
    initPreviewSection();
    initArticlePage();
  });
})();
