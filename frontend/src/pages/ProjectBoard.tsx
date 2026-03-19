import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { Task, Project } from '../types';
import { ArrowLeft, Clock, CheckCircle2, Circle, AlertCircle, Plus, Trash2 } from 'lucide-react';

type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export default function ProjectBoard() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState('');

  const fetchData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/tasks`)
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      await api.post(`/projects/${id}/tasks`, { title, description: desc, dueDate: dueDate || null });
      setTitle(''); setDesc(''); setDueDate('');
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async (taskId: number, status: Status) => {
    try {
      await api.put(`/projects/${id}/tasks/${taskId}`, { status });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleDeleteTask = async (taskId: number) => {
    if(!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/projects/${id}/tasks/${taskId}`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const columns: { title: string; status: Status; icon: React.ReactNode; color: string }[] = [
    { title: 'To Do', status: 'TODO', icon: <Circle size={20} />, color: 'text-gray-500' },
    { title: 'In Progress', status: 'IN_PROGRESS', icon: <Clock size={20} />, color: 'text-blue-500' },
    { title: 'Done', status: 'DONE', icon: <CheckCircle2 size={20} />, color: 'text-green-500' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col">
      <div className="mb-6 shrink-0">
        <Link to="/projects" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 text-sm mb-4 inline-flex font-medium">
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{project?.name || 'Loading Project...'}</h1>
        {project?.description && <p className="text-gray-500 mt-1">{project.description}</p>}
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-6 shrink-0">
        <form onSubmit={handleCreateTask} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title *</label>
            <input type="text" required placeholder="What needs to be done?" value={title} onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
          </div>
          <div className="flex-[2] min-w-[200px]">
             <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
             <input type="text" placeholder="Add more details..." value={desc} onChange={e => setDesc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
          </div>
           <div className="w-[150px]">
             <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
             <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm font-medium h-[38px]">
            <Plus size={16} /> Add Task
          </button>
        </form>
      </div>

      <div className="flex gap-6 flex-1 min-h-0 overflow-x-auto pb-4">
        {columns.map(col => (
          <div key={col.status} className="flex-1 min-w-[320px] flex flex-col bg-gray-100/60 rounded-xl p-4 border border-gray-200">
            <div className={`flex items-center gap-2 font-semibold mb-4 ${col.color}`}>
              {col.icon}
              {col.title}
              <span className="ml-auto bg-gray-200 text-gray-700 text-xs py-1 px-2 rounded-full">
                {tasks.filter(t => t.status === col.status).length}
              </span>
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
              {tasks.filter(t => t.status === col.status).map(task => (
                <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 group relative hover:shadow-md transition-shadow">
                  <button onClick={() => handleDeleteTask(task.id)} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                  <h4 className="font-semibold text-gray-900 pr-6 leading-tight">{task.title}</h4>
                  {task.description && <p className="text-gray-500 text-sm mt-2 line-clamp-3">{task.description}</p>}
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-orange-700 mt-3 font-medium bg-orange-50/80 w-fit px-2 py-1 rounded-md border border-orange-100">
                      <AlertCircle size={14} /> {task.dueDate}
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2 flex-wrap">
                    {col.status !== 'TODO' && (
                       <button onClick={() => handleUpdateStatus(task.id, 'TODO')} className="text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1.5 rounded uppercase tracking-wider transition-colors">Todo</button>
                    )}
                    {col.status !== 'IN_PROGRESS' && (
                       <button onClick={() => handleUpdateStatus(task.id, 'IN_PROGRESS')} className="text-[11px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1.5 rounded uppercase tracking-wider transition-colors">In Progress</button>
                    )}
                    {col.status !== 'DONE' && (
                       <button onClick={() => handleUpdateStatus(task.id, 'DONE')} className="text-[11px] font-semibold bg-green-50 hover:bg-green-100 text-green-700 px-2 py-1.5 rounded uppercase tracking-wider transition-colors">Done</button>
                    )}
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === col.status).length === 0 && (
                <div className="text-center p-6 text-sm text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                  No tasks here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
