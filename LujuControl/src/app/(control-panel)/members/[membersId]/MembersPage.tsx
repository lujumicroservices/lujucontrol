'use client';

import { redirect, useParams } from 'next/navigation';
import MembersForm from '../members-form/MembersForm';

function MembersPage() {
	const { contactId } = useParams<{ contactId: string }>();

	if (contactId === 'new') {
		return <MembersForm isNew />;
	}

	redirect(`/apps/contacts/${contactId}/view`);

	return null;
}

export default MembersPage;
