'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../app/lib/api';
import { useRouter } from 'next/navigation';

const schema = z.object({ name: z.string().min(2), email: z.string().email() });
type FormData = z.infer<typeof schema>;

export function UserForm({ id }: { id?: string }) {
  const qc = useQueryClient();
  const router = useRouter();

  const { data: initial } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => (await api.get(`/users/${id}`)).data,
    enabled: !!id
  });

  const { register, handleSubmit, reset, formState:{errors} } =
    useForm<FormData>({ resolver: zodResolver(schema), values: initial });

  const create = useMutation({
    mutationFn: (data: FormData) => api.post('/users', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey:['users'] }); router.push('/'); }
  });
  const update = useMutation({
    mutationFn: (data: FormData) => api.put(`/users/${id}`, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey:['users'] }); router.push('/'); }
  });
  const del = useMutation({
    mutationFn: () => api.delete(`/users/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey:['users'] }); router.push('/'); }
  });

  return (
    <form onSubmit={handleSubmit(d => id ? update.mutate(d) : create.mutate(d))}>
      <h1>{id ? 'Editar usuário' : 'Novo usuário'}</h1>
      <div>
        <label>Nome</label>
        <input {...register('name')}/>
        {errors.name && <small>{errors.name.message}</small>}
      </div>
      <div>
        <label>E-mail</label>
        <input {...register('email')}/>
        {errors.email && <small>{errors.email.message}</small>}
      </div>
      <button type="submit">{id ? 'Salvar' : 'Criar'}</button>
      {id && <button type="button" onClick={()=>del.mutate()}>Excluir</button>}
      <button type="button" onClick={()=>reset()}>Reset</button>
    </form>
  );
}
