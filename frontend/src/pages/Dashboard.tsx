import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Project } from '../types';
import { Plus, Trash2, Folder } from 'lucide-react';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      await api.post('/projects', { name, description });
      setName(''); setDescription('');
      fetchProjects();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create New Project</h2>
        <form onSubmit={handleCreate} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex-[2] min-w-[300px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 uppercase tracking-wider text-sm font-medium">
            <Plus size={18} /> Create
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col h-[200px]">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <Folder size={24} />
              </div>
              <button title="Delete Project" onClick={() => handleDelete(p.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={20} />
              </button>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{p.name}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">{p.description || 'No description'}</p>
            <Link to={`/projects/${p.id}`} className="text-blue-600 font-medium hover:text-blue-700 text-sm flex items-center gap-1 mt-auto">
              Open Board &rarr;
            </Link>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No projects found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}
