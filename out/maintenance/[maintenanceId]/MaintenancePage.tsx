'use client';

import { redirect, useParams } from 'next/navigation';
import {moduleName}}Form from '../staff-form/MaintenanceForm';

function {moduleName}}Page() {
	const { maintenanceId } = useParams<{ maintenanceId: string }>();

	if (maintenanceId === 'new') {
		return <MaintenanceForm isNew />;
	}

	redirect(`/maintenance/${staffId}/view`);

	return null;
}

export default MaintenancePage;
