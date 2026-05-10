import React, { useCallback, useEffect, useMemo, useState } from 'react';

const DataSection = ({ title, endpointPath, description }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const endpoint = useMemo(() => {
    const base = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/`
      : '/api/';
    return `${base}${endpointPath}`;
  }, [endpointPath]);

  console.log(`${title} endpoint:`, endpoint);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    console.log(`Fetching ${title} data from:`, endpoint);
    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const results = data.results || data;
        console.log(`Fetched ${title}:`, results);
        setItems(Array.isArray(results) ? results : [results]);
      })
      .catch((err) => {
        console.error(`Error fetching ${title.toLowerCase()}:`, err);
        setError(err);
        setItems([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [endpoint, title]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredItems(items);
      return;
    }

    setFilteredItems(
      items.filter((item) =>
        JSON.stringify(item).toLowerCase().includes(term)
      )
    );
  }, [items, searchTerm]);

  const columnKeys = useMemo(() => {
    if (!filteredItems.length) {
      return [];
    }

    const firstItem = filteredItems[0];
    if (typeof firstItem !== 'object' || firstItem === null) {
      return ['Value'];
    }

    const keys = filteredItems.reduce((acc, item) => {
      Object.keys(item).forEach((key) => {
        if (!acc.includes(key)) {
          acc.push(key);
        }
      });
      return acc;
    }, []);

    return keys.slice(0, 10);
  }, [filteredItems]);

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.map((entry) => JSON.stringify(entry)).join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value ?? '';
  };

  return (
    <div className="card section-card shadow-sm">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
        <div>
          <h2 className="h4 mb-1">{title}</h2>
          <p className="text-muted mb-0">
            {description || `Browse ${title.toLowerCase()} in a clean, responsive table.`}
          </p>
        </div>
        <div className="btn-toolbar">
          <button
            type="button"
            className="btn btn-primary me-2"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <a
            href={endpoint}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-secondary"
          >
            API Link
          </a>
        </div>
      </div>

      <div className="card-body">
        <form className="row g-2 align-items-center mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-sm-9">
            <label htmlFor={`${title}-search`} className="form-label visually-hidden">
              Search {title}
            </label>
            <input
              id={`${title}-search`}
              type="search"
              className="form-control"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <div className="col-sm-3 d-grid">
            <button type="button" className="btn btn-outline-primary" onClick={() => setSearchTerm('')}>
              Clear search
            </button>
          </div>
        </form>

        {error && (
          <div className="alert alert-danger" role="alert">
            Unable to load {title.toLowerCase()}. {error.message}
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle mb-0">
            <thead className="table-light">
              <tr>
                {columnKeys.map((key) => (
                  <th key={key}>{key}</th>
                ))}
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length ? (
                filteredItems.map((item, index) => (
                  <tr key={item.id ?? item.pk ?? index}>
                    {columnKeys.map((key) => (
                      <td key={key}>{formatValue(item[key])}</td>
                    ))}
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          setSelectedItem(item);
                          setShowModal(true);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columnKeys.length + 1} className="text-center py-4">
                    {loading ? 'Loading data...' : 'No results found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedItem && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-backdrop show"></div>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{title} details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <pre className="bg-light p-3 rounded">
{JSON.stringify(selectedItem, null, 2)}
                </pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSection;
