// Controller for TODO operations
const Todo = require('./model');

exports.createTodo = async (req, res) => {
  try {
    const todo = new Todo({
      userId: req.user._id,
      title: req.body.title,
      completed: false,
    });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.status === 'completed') filter.completed = true;
    if (req.query.status === 'active') filter.completed = false;
    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body, updatedAt: Date.now() },
      { new: true },
    );
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
