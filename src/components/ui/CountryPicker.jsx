import React, { useMemo, useState } from "react";
import { POPULAR_COUNTRIES } from "../../api/countries";

/**
 * Sélecteur de pays avec recherche — nécessaire dès qu'on affiche tous les
 * pays du monde (~190) plutôt qu'une courte liste fixe.
 */
export default function CountryPicker({ countries, selected, onSelect, excludeCode }) {
  const [search, setSearch] = useState("");

  const list = useMemo(() => {
    const base = excludeCode ? countries.filter((c) => c.code !== excludeCode) : countries;
    if (!search.trim()) return base;
    const q = search.trim().toLowerCase();
    return base.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [countries, search, excludeCode]);

  const showPopular = !search.trim();
  const popular = showPopular ? POPULAR_COUNTRIES.filter((c) => c.code !== excludeCode) : [];

  return (
    <div>
      <input
        type="search"
        placeholder="Rechercher un pays..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="employees-search-input"
        style={{ width: "100%", marginBottom: 12 }}
        aria-label="Rechercher un pays"
      />

      {showPopular && popular.length > 0 && (
        <>
          <p className="muted" style={{ margin: "4px 0" }}>Pays populaires</p>
          <div className="country-grid">
            {popular.map((c) => (
              <div key={c.code} className={`country ${selected?.code === c.code ? "selected" : ""}`} onClick={() => onSelect(c)}>
                <span className="flag">{c.flag}</span>{c.name}
              </div>
            ))}
          </div>
          <p className="muted" style={{ margin: "16px 0 4px" }}>Tous les pays ({list.length})</p>
        </>
      )}

      <div className="country-grid country-grid-scroll">
        {list.map((c) => (
          <div key={c.code} className={`country ${selected?.code === c.code ? "selected" : ""}`} onClick={() => onSelect(c)}>
            <span className="flag">{c.flag}</span>{c.name}
          </div>
        ))}
        {list.length === 0 && <p className="muted">Aucun pays trouvé.</p>}
      </div>
    </div>
  );
}
