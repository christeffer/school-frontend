import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

export default (reducers) => {
  const persitedReducers = persistReducer(
    {
      key: 'school-frontend',
      storage,
      whitelist: ['auth'],
    },
    reducers
  );
  return persitedReducers;
};
