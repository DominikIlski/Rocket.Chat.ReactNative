import React from 'react';
import { Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

import TextInput from '../containers/TextInput';
import Button from '../containers/Button';
import { showErrorAlert } from '../utils/info';
import isValidEmail from '../utils/isValidEmail';
import I18n from '../i18n';
import RocketChat from '../lib/rocketchat';
import { TSupportedThemes, withTheme } from '../theme';
import { themes } from '../lib/constants';
import FormContainer, { FormContainerInner } from '../containers/FormContainer';
import { events, logEvent } from '../utils/log';
import sharedStyles from './Styles';
import { OutsideParamList } from '../stacks/types';

interface IForgotPasswordViewState {
	email: string;
	invalidEmail: boolean;
	isFetching: boolean;
}

interface IForgotPasswordViewProps {
	navigation: StackNavigationProp<OutsideParamList, 'ForgotPasswordView'>;
	route: RouteProp<OutsideParamList, 'ForgotPasswordView'>;
	theme: TSupportedThemes;
}

class ForgotPasswordView extends React.Component<IForgotPasswordViewProps, IForgotPasswordViewState> {
	static navigationOptions = ({ route }: Pick<IForgotPasswordViewProps, 'route'>) => ({
		title: route.params?.title ?? 'Rocket.Chat'
	});

	state = {
		email: '',
		invalidEmail: true,
		isFetching: false
	};

	shouldComponentUpdate(nextProps: IForgotPasswordViewProps, nextState: IForgotPasswordViewState) {
		const { email, invalidEmail, isFetching } = this.state;
		const { theme } = this.props;
		if (nextProps.theme !== theme) {
			return true;
		}
		if (nextState.email !== email) {
			return true;
		}
		if (nextState.invalidEmail !== invalidEmail) {
			return true;
		}
		if (nextState.isFetching !== isFetching) {
			return true;
		}
		return false;
	}

	validate = (email: string) => {
		if (!isValidEmail(email)) {
			this.setState({ invalidEmail: true });
			return;
		}
		this.setState({ email, invalidEmail: false });
	};

	resetPassword = async () => {
		logEvent(events.FP_FORGOT_PASSWORD);
		const { email, invalidEmail } = this.state;
		if (invalidEmail || !email) {
			return;
		}
		try {
			this.setState({ isFetching: true });
			const result = await RocketChat.forgotPassword(email);
			if (result.success) {
				const { navigation } = this.props;
				navigation.pop();
				showErrorAlert(I18n.t('Forgot_password_If_this_email_is_registered'), I18n.t('Alert'));
			}
		} catch (e: any) {
			logEvent(events.FP_FORGOT_PASSWORD_F);
			const msg = (e.data && e.data.error) || I18n.t('There_was_an_error_while_action', { action: I18n.t('resetting_password') });
			showErrorAlert(msg, I18n.t('Alert'));
		}
		this.setState({ isFetching: false });
	};

	render() {
		const { invalidEmail, isFetching } = this.state;
		const { theme } = this.props;

		return (
			<FormContainer testID='forgot-password-view'>
				<FormContainerInner>
					<Text style={[sharedStyles.loginTitle, sharedStyles.textBold, { color: themes[theme].titleText }]}>
						{I18n.t('Forgot_password')}
					</Text>
					<TextInput
						autoFocus
						placeholder={I18n.t('Email')}
						keyboardType='email-address'
						returnKeyType='send'
						onChangeText={email => this.validate(email)}
						onSubmitEditing={this.resetPassword}
						testID='forgot-password-view-email'
						containerStyle={sharedStyles.inputLastChild}
						theme={theme}
					/>
					<Button
						title={I18n.t('Reset_password')}
						type='primary'
						onPress={this.resetPassword}
						testID='forgot-password-view-submit'
						loading={isFetching}
						disabled={invalidEmail}
						theme={theme}
					/>
				</FormContainerInner>
			</FormContainer>
		);
	}
}

export default withTheme(ForgotPasswordView);
