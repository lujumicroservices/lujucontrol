import { useGet{{moduleName}}ItemQuery } from './{{moduleName}}Api';

type {{moduleName}}TitleProps = {
	{{moduleNameLower}}Id?: string;
};

function {{moduleName}}Title(props: {{moduleName}}TitleProps) {
	const { {{moduleNameLower}}Id } = props;
	const { data: {{moduleNameLower}} } = useGet{{moduleName}}ItemQuery({{moduleNameLower}}Id, {
		skip: !{{moduleNameLower}}Id
	});

	return {{moduleNameLower}}?.first_name || '{{moduleName}}';
}

export default {{moduleName}}Title;