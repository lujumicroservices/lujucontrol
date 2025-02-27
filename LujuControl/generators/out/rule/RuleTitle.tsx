import { useGetRuleItemQuery } from './RuleApi';

type RuleTitleProps = {
	ruleId?: string;
};

function RuleTitle(props: RuleTitleProps) {
	const { ruleId } = props;
	const { data: rule } = useGetRuleItemQuery(ruleId, {
		skip: !ruleId
	});

	return rule?.first_name || 'Rule';
}

export default RuleTitle;