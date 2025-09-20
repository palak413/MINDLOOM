import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  Target, 
  CheckCircle, 
  Circle,
  Trash2,
  Filter,
  TrendingUp
} from 'lucide-react';
import { taskAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await taskAPI.getTasks();
      setTasks(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await taskAPI.createTask({
        ...data,
        assignedDate: new Date().toISOString()
      });
      const newTask = response.data.data;
      setTasks(prev => [newTask, ...prev]);
      reset();
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await taskAPI.completeTask(taskId);
      setTasks(prev => 
        prev.map(task => 
          task._id === taskId 
            ? { ...task, isCompleted: !task.isCompleted }
            : task
        )
      );
      toast.success('Task updated!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      toast.success('Task deleted!');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'mindfulness': return 'bg-purple-100 text-purple-800';
      case 'journaling': return 'bg-blue-100 text-blue-800';
      case 'exercise': return 'bg-green-100 text-green-800';
      case 'breathing': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'mindfulness': return '🧘';
      case 'journaling': return '📝';
      case 'exercise': return '🏃';
      case 'breathing': return '🌬️';
      default: return '📋';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.isCompleted;
    if (filter === 'pending') return !task.isCompleted;
    return true;
  });

  const completedCount = tasks.filter(task => task.isCompleted).length;
  const totalCount = tasks.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
            <p className="text-gray-600">Manage your wellness goals</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>{completedCount}/{totalCount} completed</span>
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{Math.round((completedCount / totalCount) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Description
            </label>
            <input
              type="text"
              {...register('description', { required: 'Task description is required' })}
              className="input-field"
              placeholder="What would you like to accomplish?"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="input-field"
              >
                <option value="mindfulness">Mindfulness</option>
                <option value="journaling">Journaling</option>
                <option value="exercise">Exercise</option>
                <option value="breathing">Breathing</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points
              </label>
              <input
                type="number"
                {...register('points', { 
                  required: 'Points is required',
                  min: { value: 1, message: 'Points must be at least 1' }
                })}
                className="input-field"
                placeholder="10"
                defaultValue={10}
              />
              {errors.points && (
                <p className="text-red-500 text-sm mt-1">{errors.points.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Filter and Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Your Tasks</h2>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div 
                key={task._id} 
                className={`p-4 border rounded-lg transition-all duration-200 ${
                  task.isCompleted 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-white border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => handleCompleteTask(task._id)}
                    className="mt-1 text-gray-400 hover:text-green-600 transition-colors"
                  >
                    {task.isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <p className={`font-medium ${
                      task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
                    }`}>
                      {task.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 mt-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                        <span className="mr-1">{getCategoryIcon(task.category)}</span>
                        {task.category}
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Target className="w-4 h-4" />
                        <span>{task.points} points</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(task.assignedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No tasks found</h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? 'Create your first task to get started!' 
                : `No ${filter} tasks at the moment.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
