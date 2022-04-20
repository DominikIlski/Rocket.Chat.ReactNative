import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Touchable from 'react-native-platform-touchable';

import { useTheme } from '../../theme';
import { themes } from '../../lib/constants';
import sharedStyles from '../../views/Styles';
import ActivityIndicator from '../ActivityIndicator';

interface IButtonProps {
	title: string;
	type: string;
	onPress: () => void;
	disabled: boolean;
	backgroundColor: string;
	loading: boolean;
	color: string;
	fontSize: any;
	style: any;
	styleText?: any;
	testID: string;
}

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 14,
		justifyContent: 'center',
		height: 48,
		borderRadius: 2,
		marginBottom: 12
	},
	text: {
		fontSize: 16,
		...sharedStyles.textMedium,
		...sharedStyles.textAlignCenter
	},
	disabled: {
		opacity: 0.3
	}
});

const Button = React.memo(
	({
		title = 'Press me!',
		type = 'primary',
		onPress = () => alert('It works!'),
		disabled = false,
		loading = false,
		backgroundColor,
		color,
		style,
		fontSize,
		styleText,
		...otherProps
	}: Partial<IButtonProps>) => {
		const { theme } = useTheme();
		const isPrimary = type === 'primary';

		let textColor = isPrimary ? themes[theme!].buttonText : themes[theme!].bodyText;
		if (color) {
			textColor = color;
		}

		return (
			<Touchable
				onPress={onPress}
				disabled={disabled || loading}
				style={[
					styles.container,
					backgroundColor
						? { backgroundColor }
						: { backgroundColor: isPrimary ? themes[theme!].actionTintColor : themes[theme!].backgroundColor },
					disabled && styles.disabled,
					style
				]}
				accessibilityLabel={title}
				{...otherProps}>
				{loading ? (
					<ActivityIndicator color={textColor} />
				) : (
					<Text style={[styles.text, { color: textColor }, fontSize && { fontSize }, styleText]} accessibilityLabel={title}>
						{title}
					</Text>
				)}
			</Touchable>
		);
	}
);

export default Button;
