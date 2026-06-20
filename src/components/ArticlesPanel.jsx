import { useState, useCallback } from 'react';
import { articles as curatedArticles } from '../data/articles.js';

// ── Wikipedia API helpers ──────────────────────────────────────

const WIKI_SEARCH_URL = 'https://en.wikipedia.org/w/api.php';
const WIKI_SUMMARY_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';

// Wikimedia blocks hotlinking — proxy images through weserv.nl
// Wikimedia URLs with %28 etc. break CSS url() but work fine in <img src>
// No proxy needed — just use <img> tags directly.

// Search terms cycled through for "load more"
const SEARCH_QUERIES = [
  'Vancouver British Columbia history',
  'Vancouver neighbourhoods culture',
  'Vancouver landmarks attractions',
  'Vancouver sports teams',
  'Vancouver arts music scene',
  'Vancouver architecture buildings',
  'Vancouver parks nature',
  'Vancouver food restaurants',
  'Vancouver Indigenous peoples coast salish',
  'Vancouver film television industry',
  'Gastown Vancouver',
  'Stanley Park Vancouver',
  'Granville Island Vancouver',
  'Vancouver Canucks hockey',
  'Vancouver transit SkyTrain',
  'Richmond British Columbia',
  'Surrey British Columbia',
  'Burnaby British Columbia',
  'Vancouver waterfront harbour',
  'Vancouver chinatown historic',
];

async function searchWikipedia(query) {
  const url = new URL(WIKI_SEARCH_URL);
  url.searchParams.set('action', 'query');
  url.searchParams.set('list', 'search');
  url.searchParams.set('srsearch', query);
  url.searchParams.set('srlimit', '8');
  url.searchParams.set('srnamespace', '0');
  url.searchParams.set('format', 'json');
  url.searchParams.set('origin', '*');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Wikipedia search failed: ${res.status}`);
  const data = await res.json();
  return (data.query?.search ?? []).map(r => r.title);
}

async function fetchWikiSummary(title) {
  const res = await fetch(
    `${WIKI_SUMMARY_URL}/${encodeURIComponent(title)}`,
    { headers: { 'Accept': 'application/json' } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  // Skip disambiguation pages and pages without useful content
  if (data.type === 'disambiguation' || !data.extract || data.extract.length < 80) return null;
  return data;
}

function wikiArticleToCard(summary) {
  return {
    id: `wiki-${summary.pageid}`,
    category: 'Vancouver',
    title: summary.title,
    emoji: '📰',
    imageUrl: summary.thumbnail?.source ?? null,
    imageCaption: summary.description ?? '',
    wikiUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(summary.title.replace(/ /g, '_'))}`,
    summary: summary.description
      ? `${summary.description}. ${summary.extract.slice(0, 120)}…`
      : `${summary.extract.slice(0, 160)}…`,
    // Wikipedia articles use the extract as body, rendered as paragraphs
    body: summary.extract,
    isWiki: true,
  };
}

// ── Category filter config ─────────────────────────────────────

const CATEGORIES = ['All', 'History', 'Movies & TV', 'Fun Facts', 'Famous People', 'Vancouver'];

// ── Sub-components ─────────────────────────────────────────────

function PlaceholderImage({ title }) {
  // Gradient placeholder when no image available
  const hue = Math.abs(title.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % 360;
  return (
    <div
      className="article-card-image article-card-image--placeholder"
      style={{
        background: `linear-gradient(135deg,
          hsl(${hue},40%,20%) 0%,
          hsl(${(hue + 60) % 360},50%,30%) 100%)`
      }}
    >
      <span className="placeholder-icon">🌊</span>
    </div>
  );
}

function ArticleCard({ article, onOpen }) {
  return (
    <button className="article-card" onClick={() => onOpen(article)}>
      <div className="article-card-image" aria-hidden="true">
        {article.imageUrl
          ? <img src={article.imageUrl} alt="" className="article-card-img-tag" loading="lazy" />
          : <span className="placeholder-icon">{article.emoji}</span>
        }
        <span className={`article-category-badge${article.isWiki ? ' wiki-badge' : ''}`}>
          {article.category}
        </span>
      </div>
      <div className="article-card-body">
        <div className="article-emoji">{article.emoji}</div>
        <h3 className="article-card-title">{article.title}</h3>
        <p className="article-card-summary">{article.summary}</p>
        <span className="article-read-more">Read more →</span>
      </div>
    </button>
  );
}

function renderBody(text) {
  return text.split('\n\n').filter(Boolean).map((para, i) => {
    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="article-body-paragraph">
        {parts.map((p, j) =>
          p.startsWith('**') && p.endsWith('**')
            ? <strong key={j}>{p.slice(2, -2)}</strong>
            : p
        )}
      </p>
    );
  });
}

function ArticleModal({ article, onClose }) {
  return (
    <div
      className="article-modal-overlay"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="article-modal" role="dialog" aria-modal="true">
        <button className="article-modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Hero */}
        <div className="article-modal-hero">
          {article.imageUrl && (
            <img src={article.imageUrl} alt={article.title} className="article-modal-hero-img" />
          )}
          <div className="article-modal-hero-overlay">
            <span className={`article-category-badge${article.isWiki ? ' wiki-badge' : ''}`}>
              {article.category}
            </span>
            <h2 className="article-modal-title">{article.emoji} {article.title}</h2>
            {article.imageCaption && (
              <p className="article-modal-caption">{article.imageCaption}</p>
            )}
          </div>
        </div>

        <div className="article-modal-content">
          <p className="article-modal-summary">{article.summary}</p>

          {/* Wikipedia link */}
          {article.wikiUrl && (
            <a
              className="article-wiki-link"
              href={article.wikiUrl}
              target="_blank"
              rel="noreferrer"
            >
              <span>📖</span> Read full article on Wikipedia ↗
            </a>
          )}

          <hr className="article-divider" />
          <div className="article-body">
            {renderBody(article.body)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────

export default function ArticlesPanel() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openArticle, setOpenArticle]           = useState(null);
  const [wikiArticles, setWikiArticles]         = useState([]);
  const [isLoadingMore, setIsLoadingMore]       = useState(false);
  const [loadMoreError, setLoadMoreError]       = useState('');
  const [searchIndex, setSearchIndex]           = useState(0);
  const [loadedTitles]                          = useState(new Set()); // track duplicates

  const allArticles = [...curatedArticles, ...wikiArticles];

  const filtered = selectedCategory === 'All'
    ? allArticles
    : allArticles.filter(a => a.category === selectedCategory);

  const loadMoreFromWikipedia = useCallback(async () => {
    setIsLoadingMore(true);
    setLoadMoreError('');

    try {
      const query = SEARCH_QUERIES[searchIndex % SEARCH_QUERIES.length];
      setSearchIndex(i => i + 1);

      const titles = await searchWikipedia(query);
      const summaries = await Promise.all(
        titles.map(t => fetchWikiSummary(t))
      );

      const newCards = summaries
        .filter(s => s !== null)
        .filter(s => !loadedTitles.has(s.title))
        .map(s => {
          loadedTitles.add(s.title);
          return wikiArticleToCard(s);
        });

      setWikiArticles(prev => [...prev, ...newCards]);

      if (newCards.length === 0) {
        setLoadMoreError('No new articles found for this search — try again for different results.');
      }
    } catch (err) {
      setLoadMoreError(`Could not load articles: ${err.message}`);
    } finally {
      setIsLoadingMore(false);
    }
  }, [searchIndex, loadedTitles]);

  return (
    <section className="panel articles-panel">
      <div className="panel-heading">
        <p className="eyebrow">Explore Vancouver</p>
        <h1>Discover</h1>
        <p className="subtitle">
          History, movies, fun facts, and famous faces — all about Vancouver.
        </p>
      </div>

      {/* Category filter */}
      <div className="article-filter-row">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-chip${selectedCategory === cat ? ' active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Article grid */}
      <div className="article-grid">
        {filtered.map(article => (
          <ArticleCard key={article.id} article={article} onOpen={setOpenArticle} />
        ))}
      </div>

      {/* Load more — always visible below the grid */}
      <div className="load-more-row">
        <button
          className="load-more-btn"
          onClick={loadMoreFromWikipedia}
          disabled={isLoadingMore}
        >
          {isLoadingMore
            ? <><span className="load-more-spinner" /> Searching Wikipedia…</>
            : <><span>🔍</span> See more Vancouver articles</>
          }
        </button>
        {loadMoreError && (
          <p className="info-text" style={{ textAlign: 'center', fontSize: '0.78rem' }}>
            {loadMoreError}
          </p>
        )}
      </div>

      {/* Modal */}
      {openArticle && (
        <ArticleModal article={openArticle} onClose={() => setOpenArticle(null)} />
      )}
    </section>
  );
}
