'use client';

import { redirect, useParams } from 'next/navigation';
import MembersForm from '../members-form/MembersForm';

function MembersPage() {
	const { memberId } = useParams<{ memberId: string }>();

	if (memberId === 'new') {
		return <MembersForm isNew />;
	}

	redirect(`/members/${memberId}/view`);

	return null;
}

export default MembersPage;
