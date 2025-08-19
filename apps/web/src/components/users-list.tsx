'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '../app/lib/api';

type User = { id: string; name: string; email: string };

function UsersListInner() {
  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users')).data,
  });

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar.</p>;

  return (
    <ul>
      {data?.map((u) => (
        <li key={u.id}>
          <b>{u.name}</b> — {u.email}
        </li>
      ))}
    </ul>
  );
}

export default function UsersList() {
  return (
    <div>
      <h1>Usuários</h1>
      <UsersListInner />
    </div>
  );
}
