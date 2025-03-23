'use client';

import { redirect, useParams } from 'next/navigation';
import {moduleName}}Form from '../staff-form/ResidentForm';

function {moduleName}}Page() {
	const { residentId } = useParams<{ residentId: string }>();

	if (residentId === 'new') {
		return <ResidentForm isNew />;
	}

	redirect(`/resident/${staffId}/view`);

	return null;
}

export default ResidentPage;
