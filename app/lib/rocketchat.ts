// Spread Methods
import * as sendMessage from './methods/sendMessage';
import * as enterpriseModules from './methods/enterpriseModules';
import * as getPermalinks from './methods/getPermalinks';
import * as getRoles from './methods/getRoles';
import * as getSettings from './methods/getSettings';
import * as getUsersPresence from './methods/getUsersPresence';
import * as helpers from './methods/helpers';
import * as logout from './methods/logout';
import * as search from './methods/search';
import * as sendFileMessage from './methods/sendFileMessage';
import * as setUser from './methods/setUser';
import * as connect from './services/connect';
import * as restApis from './services/restApi';
import * as shareExtension from './services/shareExtension';

const RocketChat = {
	...restApis,
	...search,
	...getPermalinks,
	...connect,
	...enterpriseModules,
	...sendMessage,
	...shareExtension,
	...sendFileMessage,
	...logout,
	...getUsersPresence,
	...getSettings,
	...getRoles,
	...helpers,
	...setUser // this
};

export default RocketChat;
