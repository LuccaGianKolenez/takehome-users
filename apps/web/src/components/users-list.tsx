'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '../app/lib/api';
import Link from 'next/link';

type User = { id:string; name:string; email:string };

export function UsersList() {
  const { data } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => (await api.get('/users')).data
  });

  return (
    <div>
      <h1>Usuários</h1>
      <Link href="/users/new">+ Novo</Link>
      <ul>{data?.map(u=>(
        <li key={u.id}>
          <b>{u.name}</b> — {u.email} &nbsp;
          <Link href={`/users/${u.id}/edit`}>Editar</Link>
        </li>
      ))}</ul>
    </div>
  );
}
