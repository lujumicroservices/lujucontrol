'use client';

import { redirect, useParams } from 'next/navigation';
import {moduleName}}Form from '../staff-form/FacilityForm';

function {moduleName}}Page() {
	const { facilityId } = useParams<{ facilityId: string }>();

	if (facilityId === 'new') {
		return <FacilityForm isNew />;
	}

	redirect(`/facility/${staffId}/view`);

	return null;
}

export default FacilityPage;
