import TodosTable from './TodosTable';
import { useTodosQuery } from '~/data-provider/todos';

const TodosPanel = () => {
  useTodosQuery();
  return (
    <div className="h-auto max-w-full overflow-x-hidden">
      <TodosTable />
    </div>
  );
};

export default TodosPanel;
