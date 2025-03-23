'use client';

import { redirect, useParams } from 'next/navigation';
import UsersForm from '../users-form/UsersForm';

function UsersPage() {
	const { usersId } = useParams<{ usersId: string }>();

	if (usersId === 'new') {
		return <UsersForm isNew />;
	}

	redirect(`/users/${ usersId}/view`);

	return null;
}

export default UsersPage;
