import {
	Notifications,
	Registered,
	RegistrationError,
	NotificationCompletion,
	Notification,
	NotificationAction,
	NotificationCategory
} from 'react-native-notifications';

import { INotification } from '../../definitions/INotification';
import { isIOS } from '../../utils/deviceInfo';
import { store as reduxStore } from '../store/auxStore';
import I18n from '../../i18n';

class PushNotification {
	onNotification: (notification: any) => void;
	deviceToken: string;
	constructor() {
		this.onNotification = () => {};
		this.deviceToken = '';
		if (isIOS) {
			// init
			Notifications.ios.registerRemoteNotifications();

			// setCategories
			const notificationAction = new NotificationAction('REPLY_ACTION', 'background', I18n.t('Reply'), true, {
				buttonTitle: I18n.t('Reply'),
				placeholder: I18n.t('Type_message')
			});
			const notificationCategory = new NotificationCategory('MESSAGE', [notificationAction]);
			Notifications.setCategories([notificationCategory]);
		} else {
			// init
			Notifications.android.registerRemoteNotifications();
		}

		Notifications.events().registerRemoteNotificationsRegistered((event: Registered) => {
			this.deviceToken = event.deviceToken;
		});

		Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
			// TODO: Handle error
			console.log(event);
		});

		Notifications.events().registerNotificationReceivedForeground(
			(notification: Notification, completion: (response: NotificationCompletion) => void) => {
				completion({ alert: false, sound: false, badge: false });
			}
		);

		Notifications.events().registerNotificationOpened((notification: Notification, completion: () => void) => {
			if (isIOS) {
				const { background } = reduxStore.getState().app;
				if (background) {
					this.onNotification(notification);
				}
			} else {
				this.onNotification(notification);
			}
			completion();
		});

		Notifications.events().registerNotificationReceivedBackground(
			(notification: Notification, completion: (response: any) => void) => {
				completion({ alert: true, sound: true, badge: false });
			}
		);
	}

	getDeviceToken() {
		return this.deviceToken;
	}

	setBadgeCount = (count?: number) => {
		if (isIOS && count) {
			Notifications.ios.setBadgeCount(count);
		}
	};

	configure(onNotification: (notification: INotification) => void): Promise<any> {
		this.onNotification = onNotification;
		return Notifications.getInitialNotification();
	}
}

export default new PushNotification();
