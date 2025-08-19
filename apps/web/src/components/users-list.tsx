'use client';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import UserForm, { UserFormValues } from './user-form';
import { api } from '@/app/lib/api';

type User = { id: string; name: string; email: string; createdAt: string };

function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users')).data,
  });
}

export default function UsersList() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useUsers();

  const createMutation = useMutation({
    mutationFn: async (values: Omit<UserFormValues, 'id'>) =>
      (await api.post('/users', values)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  const updateMutation = useMutation({
    mutationFn: async (values: UserFormValues) =>
      (await api.put(`/users/${values.id}`, { name: values.name, email: values.email })).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/users/${id}`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  // controle de modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const rows = useMemo(() => data ?? [], [data]);

  const onCreate = () => {
    setEditing(null);
    setOpen(true);
  };

  const onEdit = (u: User) => {
    setEditing(u);
    setOpen(true);
  };

  const onSubmit = async (values: UserFormValues) => {
    if (editing?.id) {
      await updateMutation.mutateAsync({ ...values, id: editing.id });
    } else {
      await createMutation.mutateAsync({ name: values.name, email: values.email });
    }
    setOpen(false);
  };

  const onDelete = async (u: User) => {
    if (confirm(`Excluir ${u.name}?`)) {
      await deleteMutation.mutateAsync(u.id);
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar.</p>;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Usuários</h2>
        <button onClick={onCreate}>Adicionar usuário</button>
      </div>

      <table width="100%" cellPadding={8} style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Nome</th>
            <th align="left">E-mail</th>
            <th align="left">Criado em</th>
            <th align="left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} style={{ borderTop: '1px solid #eee' }}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{new Date(u.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => onEdit(u)}>Editar</button>{' '}
                <button onClick={() => onDelete(u)} style={{ color: 'crimson' }}>Excluir</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td colSpan={4} style={{ padding: 16, opacity: 0.7 }}>Sem usuários ainda.</td></tr>
          )}
        </tbody>
      </table>

      {open && (
        <dialog open style={{ padding: 0, border: '1px solid #ddd', borderRadius: 8 }}>
          <div style={{ padding: 12, borderBottom: '1px solid #eee' }}>
            <b>{editing ? 'Editar usuário' : 'Novo usuário'}</b>
          </div>
          <UserForm
            initial={editing ?? undefined}
            onSubmit={onSubmit}
            onCancel={() => setOpen(false)}
          />
        </dialog>
      )}
    </div>
  );
}
