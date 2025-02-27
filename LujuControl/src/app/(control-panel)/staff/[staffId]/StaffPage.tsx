'use client';

import { redirect, useParams } from 'next/navigation';
import StaffForm from '../staff-form/StaffForm';

function StaffPage() {
	const { staffId } = useParams<{ staffId: string }>();

	if (staffId === 'new') {
		return <StaffForm isNew />;
	}

	redirect(`/staff/${staffId}/view`);

	return null;
}

export default StaffPage;
