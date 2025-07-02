import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dataService } from 'librechat-data-provider';
import type {
  TTodo,
  TTodosResponse,
  TTodoRequest,
  TCreateTodo,
  TCreateTodoResponse,
  TUpdateTodo,
  TUpdateTodoResponse,
  TDeleteTodoResponse,
} from 'librechat-data-provider';


export function useTodosQuery(status?: string) {
  return useQuery<TTodo[]>({
    queryKey: ['todos', status],
    queryFn: () => dataService.getTodos(status),
  });
}

export const createTodo = async (payload: TCreateTodo): Promise<TCreateTodoResponse> => {
  return dataService.createTodo(payload);
};

export function useCreateTodoMutation() {
  const queryClient = useQueryClient();
  return useMutation<TCreateTodoResponse, unknown, TCreateTodo>({
    mutationFn: createTodo,
    onSuccess: () => queryClient.invalidateQueries(['todos']),
  });
}

export const updateTodo = async ({
  id,
  updates,
}: {
  id: string;
  updates: TUpdateTodo;
}): Promise<TUpdateTodoResponse> => {
  return dataService.updateTodo(id, updates);
};

export function useUpdateTodoMutation() {
  const queryClient = useQueryClient();
  return useMutation<TUpdateTodoResponse, unknown, { id: string; updates: TUpdateTodo }>({
    mutationFn: updateTodo,
    onSuccess: () => queryClient.invalidateQueries(['todos']),
  });
}

export const deleteTodo = async (id: string): Promise<TDeleteTodoResponse> => {
  return dataService.deleteTodo(id);
};

export function useDeleteTodoMutation() {
  const queryClient = useQueryClient();
  return useMutation<TDeleteTodoResponse, unknown, string>({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries(['todos']),
  });
}
