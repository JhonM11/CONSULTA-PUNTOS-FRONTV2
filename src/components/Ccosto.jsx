import React, { useEffect, useState } from 'react';
import { getAllCcosto } from '../services/ccostoService';
import { useAuth } from './AuthContext';
import { FiEdit2, FiSearch } from 'react-icons/fi';
import '../styles/ccosto.css';

function Ccosto() {
  const { token } = useAuth();
  const [centros, setCentros] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCcosto(token);
        setCentros(data);
        setFiltered(data);
      } catch (err) {
        console.error('Error al cargar centros de costos', err);
      }
    };
    if (token) fetchData();
  }, [token]);

  useEffect(() => {
    const result = centros.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toString().includes(search)
    );
    setFiltered(result);
    setCurrentPage(1);
  }, [search, centros]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="ccosto-container">
      <div className="ccosto-search">
        <FiSearch className="ccosto-search-icon" />
        <input
          type="text"
          placeholder="Buscar por código o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="ccosto-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((item) => (
            <tr key={item.code}>
              <td>{item.code}</td>
              <td>{item.name}</td>
              <td>
                <button className="ccosto-edit-btn" title="Editar">
                  <FiEdit2 size={16} />
                </button>
              </td>
            </tr>
          ))}
          {paginatedItems.length === 0 && (
            <tr>
              <td colSpan="3" className="ccosto-empty">No hay resultados.</td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="ccosto-pagination">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={currentPage === idx + 1 ? 'active' : ''}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Ccosto;
