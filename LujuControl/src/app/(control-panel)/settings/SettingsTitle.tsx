import { useGetSettingsItemQuery } from './SettingsApi';

type SettingsTitleProps = {
	settingsId?: string;
};

function SettingsTitle(props: SettingsTitleProps) {
	const { settingsId } = props;
	const { data: settings } = useGetSettingsItemQuery(settingsId, {
		skip: !settingsId
	});

	return settings?.first_name || 'Settings';
}

export default SettingsTitle;