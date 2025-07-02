import TodosTable from './TodosTable';
import { useTodosQuery } from '~/data-provider/todos';

const TodosPanel = () => {
  useTodosQuery();
  return (
    <div className="flex h-full max-w-full flex-col overflow-x-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <TodosTable />
      </div>
    </div>
  );
};

export default TodosPanel;
