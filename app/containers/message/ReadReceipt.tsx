import React from 'react';

import { themes } from '../../constants/colors';
import { CustomIcon } from '../CustomIcon';
import styles from './styles';
import { useTheme } from '../../theme';

const ReadReceipt = React.memo(({ isReadReceiptEnabled, unread }: { isReadReceiptEnabled?: boolean; unread: boolean }) => {
	const { theme } = useTheme();
	if (isReadReceiptEnabled && !unread && unread !== null) {
		return <CustomIcon name='check' color={themes[theme].tintColor} size={15} style={styles.readReceipt} />;
	}
	return null;
});
ReadReceipt.displayName = 'MessageReadReceipt';

export default ReadReceipt;
