import { v4 as uuidv4 } from 'uuid';

import {
  Folder,
  FolderCollection,
} from '@type/chat';
import {
  _defaultChatConfig,
  defaultModel,
  defaultUserMaxToken,
} from '@constants/chat';
import { officialAPIEndpoint } from '@constants/auth';
import defaultPrompts from '@constants/prompt';

