'use client';

import { redirect, useParams } from 'next/navigation';
import {moduleName}}Form from '../staff-form/ViolationForm';

function {moduleName}}Page() {
	const { violationId } = useParams<{ violationId: string }>();

	if (violationId === 'new') {
		return <ViolationForm isNew />;
	}

	redirect(`/violation/${staffId}/view`);

	return null;
}

export default ViolationPage;
