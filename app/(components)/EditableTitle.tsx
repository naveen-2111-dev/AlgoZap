'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';

export default function EditableTitle() {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('Untitled Flow');

  const handleRename = () => {
    const newTitle = title.trim();
    setTitle(newTitle || 'Untitled Flow');
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-2 mx-auto group">
      {isEditing ? (
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          autoFocus
          className="text-lg font-semibold tracking-wide bg-transparent border border-white/30 text-white px-2 py-1 rounded-md w-48 text-center outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      ) : (
        <>
          <h1 className="text-lg font-semibold text-white tracking-wide select-none">
            {title}
          </h1>
          <button
            onClick={() => setIsEditing(true)}
            className="text-white opacity-0 group-hover:opacity-80 hover:opacity-100 transition"
            title="Rename"
          >
            <Pencil size={16} />
          </button>
        </>
      )}
    </div>
  );
}
