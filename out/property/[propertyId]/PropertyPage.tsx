'use client';

import { redirect, useParams } from 'next/navigation';
import {moduleName}}Form from '../staff-form/PropertyForm';

function {moduleName}}Page() {
	const { propertyId } = useParams<{ propertyId: string }>();

	if (propertyId === 'new') {
		return <PropertyForm isNew />;
	}

	redirect(`/property/${staffId}/view`);

	return null;
}

export default PropertyPage;
