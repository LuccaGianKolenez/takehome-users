'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
});
export type UserFormValues = z.infer<typeof userSchema>;

type Props = {
  initial?: Partial<UserFormValues>;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  onCancel: () => void;
};

export default function UserForm({ initial, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { id: undefined, name: '', email: '', ...initial },
  });

  useEffect(() => {
    reset({ id: initial?.id, name: initial?.name ?? '', email: initial?.email ?? '' });
  }, [initial, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: 'grid', gap: 12, minWidth: 360, padding: 12 }}
    >
      <div>
        <label>Nome</label>
        <input {...register('name')} placeholder="Fulano" />
        {errors.name && <p style={{ color: 'crimson' }}>{errors.name.message}</p>}
      </div>

      <div>
        <label>E-mail</label>
        <input {...register('email')} placeholder="fulano@exemplo.com" />
        {errors.email && <p style={{ color: 'crimson' }}>{errors.email.message}</p>}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button type="submit" disabled={isSubmitting}>
          {initial?.id ? 'Salvar alterações' : 'Criar usuário'}
        </button>
        <button type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
