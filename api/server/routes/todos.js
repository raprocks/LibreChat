// Routes for TODO API
const express = require('express');
const router = express.Router();
const { PermissionTypes, Permissions } = require('librechat-data-provider');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('~/models/Todo');
// All routes require authentication middleware (assume req.user is set)
// Adjust the middleware import as per your codebase, e.g., requireAuth
const { requireJwtAuth, generateCheckAccess } = require('~/server/middleware');

const checkTodoAccess = generateCheckAccess(PermissionTypes.TODOS, [Permissions.USE]);

router.use(requireJwtAuth);
router.use(checkTodoAccess);

/**
 * GET /
 * Retrieves all todos for the authenticated user.
 * User can pass in status to filter by using query parameters (?status=active|completed)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/', async (req, res) => {
  try {
    console.log('Fetching todos for user:', req.user.id, 'with status:', req.query.status);
    const todos = await getTodos(req.user.id, req.query.status);
    if (todos) {
      res.status(200).json(todos);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    console.error('Error getting todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /
 * Creates a new todo for the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/', async (req, res) => {
  try {
    const { title, description } = req.body;
    const todo = await createTodo(req.user.id, title, description);
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /:id
 * Updates an existing todo for the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.put('/:id', async (req, res) => {
  try {
    const todo = await updateTodo(req.user.id, req.params.id, req.body);
    if (todo) {
      res.status(200).json(todo);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /:id
 * Deletes a todo for the authenticated user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteTodo(req.user.id, req.params.id);
    if (deleted) {
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
