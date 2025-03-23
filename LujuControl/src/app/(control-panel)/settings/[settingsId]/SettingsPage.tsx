'use client';

import { redirect, useParams } from 'next/navigation';
import SettingsForm from '../settings-form/SettingsForm';

function SettingsPage() {
	const { settingsId } = useParams<{ settingsId: string }>();

	if (settingsId === 'new') {
		return <SettingsForm isNew />;
	}

	redirect(`/settings/${ settingsId}/view`);

	return null;
}

export default SettingsPage;
