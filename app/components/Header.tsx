import React from 'react';
import { FaSearch, FaPlus, FaList } from 'react-icons/fa';

interface HeaderProps {
  title: string;
  showSearchBar?: boolean;
  showSearchButton?: boolean;
  showAddButton?: boolean;
  showListButton?: boolean;
  searchValue?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
  onAdd?: () => void;
  onList?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showSearchBar = false, 
  showSearchButton = false, 
  showAddButton = false,
  showListButton = false,
  searchValue = "",
  onSearchChange, 
  onSearch, 
  onAdd,
  onList }) => {
  return (
    <div>
      <div className="bg-blue-500 text-white p-3 rounded-md text-center text-lg font-bold">
        {title}
      </div>

      {/* Search and Add Buttons */}
      {(showSearchBar || showSearchButton || showAddButton || showListButton) && (
        <div className="flex justify-between my-4">
          {(showSearchBar &&
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={onSearchChange ? searchValue : undefined}
              onChange={onSearchChange}
              className="border p-2 rounded w-full max-w-md text-gray-900"
            />
          )}
          <div className="flex gap-2">
            {showSearchButton && (
              <button 
                className="bg-gray-400 p-2 rounded text-white" 
                onClick={onSearch}
              >
                <FaSearch />
              </button>
            )}
            {showAddButton && (
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded" 
                onClick={onAdd}
              >
                <FaPlus />
              </button>
            )}
            {showListButton && (
              <button 
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded" 
                onClick={onList}
              >
                <FaList />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
