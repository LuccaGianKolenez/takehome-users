import { UserForm } from '../../../../components/user-form';
export default function EditUser({ params }: { params: { id: string }}) {
  return <UserForm id={params.id} />;
}
