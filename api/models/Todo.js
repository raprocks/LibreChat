// Mongoose model for TODOs
const { todoSchema } = require('@librechat/data-schemas');
const mongoose = require('mongoose');
const logger = require('~/config/winston');

const Todo = mongoose.model('Todo', todoSchema);

/**
 * Retrieves all TODOs for a user.
 * @param {string} user - The user ID.
 * @param {string} [status] - Optional status filter ('active' or 'completed').
 * @returns {Promise<Array<Todo>>} An array of TODOs.
 */
const getTodos = async (user, status) => {
  try {
    const filter = { user };
    if (status === 'completed') filter.completed = true;
    if (status === 'active') filter.completed = false;
    return await Todo.find(filter).sort({ createdAt: -1 }).lean();
  } catch (error) {
    logger.error('[getTodos] Error getting todos', error);
    throw new Error('Error getting todos');
  }
};

/**
 * Creates a new TODO for a user.
 * @param {string} user - The user ID.
 * @param {string} title - The TODO title.
 * @returns {Promise<Object>} The created TODO.
 */
// Accepts both title and description
const createTodo = async (user, title, description) => {
  try {
    const todo = new Todo({ user, title, description, completed: false });
    await todo.save();
    return todo.toObject();
  } catch (error) {
    logger.error('[createTodo] Error creating todo', error);
    throw new Error('Error creating todo');
  }
};

/**
 * Updates a TODO for a user.
 * @param {string} user - The user ID.
 * @param {string} id - The TODO ID.
 * @param {Object} updates - The fields to update.
 * @returns {Promise<Object|null>} The updated TODO or null if not found.
 */
const updateTodo = async (user, id, updates) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, user },
      { $set: updates, updatedAt: Date.now() },
      { new: true },
    ).lean();
    return todo;
  } catch (error) {
    logger.error('[updateTodo] Error updating todo', error);
    throw new Error('Error updating todo');
  }
};

/**
 * Deletes a TODO for a user.
 * @param {string} user - The user ID.
 * @param {string} id - The TODO ID.
 * @returns {Promise<boolean>} True if deleted, false otherwise.
 */
const deleteTodo = async (user, id) => {
  try {
    const result = await Todo.deleteOne({ _id: id, user });
    return result.deletedCount > 0;
  } catch (error) {
    logger.error('[deleteTodo] Error deleting todo', error);
    throw new Error('Error deleting todo');
  }
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
