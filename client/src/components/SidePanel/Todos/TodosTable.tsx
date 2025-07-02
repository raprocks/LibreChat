import React, { useMemo, useState } from 'react';
import { Trash2, Pencil, Plus } from 'lucide-react';
import {
  Table,
  Input,
  Button,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableHeader,
} from '~/components/ui';
import { Checkbox } from '~/components/ui/Checkbox';
import { Label } from '~/components/ui/Label';
import {
  useTodosQuery,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useCreateTodoMutation,
} from '~/data-provider/todos';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '~/components/ui/Dialog';
import { Textarea } from '~/components/ui/Textarea';
import OGDialogTemplate from '~/components/ui/OGDialogTemplate';
import Spinner from '~/components/svg/Spinner';

const pageSize = 10;

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
];

const TodosTable = () => {
  const { data: todos = [], isLoading, error } = useTodosQuery();
  const updateTodoMutation = useUpdateTodoMutation();
  const deleteTodoMutation = useDeleteTodoMutation();
  const createTodoMutation = useCreateTodoMutation();
  const [searchQuery, setSearchQuery] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Create dialog state
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Edit dialog state
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const filteredTodos = useMemo(() => {
    let filtered = todos;
    if (filter === 'active') filtered = filtered.filter((t) => t.status !== 'Completed');
    if (filter === 'completed') filtered = filtered.filter((t) => t.status === 'Completed');
    if (searchQuery)
      filtered = filtered.filter((todo) =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return filtered;
  }, [todos, filter, searchQuery]);

  const currentRows = filteredTodos.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

  // Handlers for create
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createTodoMutation.mutate({ title: newTitle, description: newDescription });
    setNewTitle('');
    setNewDescription('');
    setCreateOpen(false);
  };

  // Handlers for edit
  const openEditDialog = (todo: any) => {
    setEditId(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditOpen(todo._id);
  };
  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    updateTodoMutation.mutate({
      id: editId,
      updates: { title: editTitle, description: editDescription },
    });
    setEditOpen(null);
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Filter Buttons */}
      <div className="flex items-center gap-2 px-2 pb-2">
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f.key as any)}
          >
            {f.label}
          </Button>
        ))}
      </div>
      <div className="border-border-light rounded-lg border bg-transparent shadow-sm transition-colors">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="border-border-light border-b">
              <TableHead className="bg-surface-secondary text-text-secondary w-[5%] py-1 text-left text-sm font-medium"></TableHead>
              <TableHead className="bg-surface-secondary text-text-secondary w-[45%] py-1 text-left text-sm font-medium">
                <div className="px-2">Title</div>
              </TableHead>
              <TableHead className="bg-surface-secondary text-text-secondary w-[35%] py-1 text-left text-sm font-medium">
                <div className="px-2">Description</div>
              </TableHead>
              <TableHead className="bg-surface-secondary text-text-secondary w-[15%] py-1 text-left text-sm font-medium">
                <div className="px-2">Actions</div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRows.length ? (
              currentRows.map((todo) => (
                <TableRow key={todo._id} className="h-auto min-h-0 py-0">
                  <TableCell className="py-1 align-middle">
                    <Checkbox
                      checked={todo.status === 'Completed'}
                      onCheckedChange={(checked) => {
                        updateTodoMutation.mutate({
                          id: todo._id,
                          updates: { status: checked ? 'Completed' : 'Pending' },
                        });
                      }}
                      id={`todo-${todo._id}`}
                    />
                  </TableCell>
                  <TableCell className="py-1 align-middle">
                    <Label
                      htmlFor={`todo-${todo._id}`}
                      className={
                        todo.status === 'Completed' ? 'text-muted-foreground line-through' : ''
                      }
                    >
                      {todo.title}
                    </Label>
                  </TableCell>
                  <TableCell className="text-muted-foreground py-1 align-middle text-xs">
                    {todo.description || (
                      <span className="text-gray-400 italic">No description</span>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-1 py-1 align-middle">
                    <Dialog
                      open={editOpen === todo._id}
                      onOpenChange={(open) => {
                        if (!open) setEditOpen(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Edit todo"
                          onClick={() => openEditDialog(todo)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <OGDialogTemplate
                        title="Edit Todo"
                        description="Update the title and description."
                        main={
                          <form onSubmit={handleEdit} className="space-y-2">
                            <Input
                              placeholder="Title"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              required
                            />
                            <Textarea
                              placeholder="Description (optional)"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              rows={2}
                            />
                          </form>
                        }
                        buttons={
                          <Button
                            type="submit"
                            disabled={updateTodoMutation.isLoading || !editTitle.trim()}
                            onClick={handleEdit}
                            variant="submit"
                          >
                            {updateTodoMutation.isLoading ? <Spinner /> : 'Save'}
                          </Button>
                        }
                      />
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodoMutation.mutate(todo._id)}
                      disabled={deleteTodoMutation.isLoading}
                      aria-label="Delete todo"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-text-secondary h-12 text-center text-sm">
                  No todos found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination and Add Todo button at the bottom */}
      {filteredTodos.length > 0 && (
        <div className="flex items-center justify-between">
          {/* Add Todo button bottom left */}
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Add Todo
              </Button>
            </DialogTrigger>
            <OGDialogTemplate
              title="Add Todo"
              description="Enter a title and description for your todo."
              main={
                <form onSubmit={handleCreate} className="space-y-2">
                  <Input
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                  />
                </form>
              }
              buttons={
                <Button
                  type="submit"
                  disabled={createTodoMutation.isLoading || !newTitle.trim()}
                  onClick={handleCreate}
                  variant="submit"
                >
                  {createTodoMutation.isLoading ? <Spinner /> : 'Add'}
                </Button>
              }
            />
          </Dialog>
          <div className="flex items-center gap-2" role="navigation" aria-label="Pagination">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
              disabled={pageIndex === 0}
              aria-label="Previous page"
            >
              Prev
            </Button>
            <div aria-live="polite" className="text-sm">
              {`${pageIndex + 1} / ${Math.ceil(filteredTodos.length / pageSize)}`}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setPageIndex((prev) =>
                  (prev + 1) * pageSize < filteredTodos.length ? prev + 1 : prev,
                )
              }
              disabled={(pageIndex + 1) * pageSize >= filteredTodos.length}
              aria-label="Next page"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {/* If no todos, show Add Todo button centered at bottom */}
      {filteredTodos.length === 0 && (
        <div className="flex justify-start pt-4">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Add Todo
              </Button>
            </DialogTrigger>
            <OGDialogTemplate
              title="Add Todo"
              description="Enter a title and description for your todo."
              main={
                <form onSubmit={handleCreate} className="space-y-2">
                  <Input
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={2}
                  />
                </form>
              }
              buttons={
                <Button
                  type="submit"
                  disabled={createTodoMutation.isLoading || !newTitle.trim()}
                  onClick={handleCreate}
                  variant="submit"
                >
                  {createTodoMutation.isLoading ? <Spinner /> : 'Add'}
                </Button>
              }
            />
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default TodosTable;
