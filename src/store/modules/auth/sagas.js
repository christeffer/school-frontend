import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import * as actions from './actions';
import * as types from '../types';
import axios from '../../../services/axios';
import history from '../../../services/history';

function* loginRequest({ payload }) {
  try {
    const response = yield call(axios.post, '/tokens/', payload);
    // if success redirect action to this
    yield put(actions.loginSuccess({ ...response.data }));
    toast.success('Logged in');
    // set default header to use a Berar with token
    axios.defaults.headers.Authorization = `Bearer ${response.data.token}`;
    // set prevPath that was attempting to access
    history.push(payload.prevPath);
  } catch (e) {
    toast.error('Invalid email or password ');
    // set failure to login failure
    yield put(actions.loginFailure());
  }
}

function persisteRehydrate({ payload }) {
  const token = get(payload, 'auth.token', '');
  if (!token) return;
  // set default header to use a Berar with token when not passing in loginRequest
  axios.defaults.headers.Authorization = `Bearer ${token}`;
}

// eslint-disable-next-line consistent-return
function* registerRequest({ payload }) {
  const { id, name, email, password } = payload;

  try {
    if (id) {
      yield call(axios.put, '/users', {
        name,
        email,
        password: password || undefined,
      });

      toast.success('Data updated');

      yield put(actions.registerUpdatedSuccess({ name, email, password }));
    } else {
      yield call(axios.post, '/users', {
        name,
        email,
        password,
      });
      toast.success('User created');
      yield put(actions.registerCreatedSuccess({ name, email, password }));
      history.push('/login');
    }
  } catch (e) {
    const errors = get(e, 'response.data.errors', []);
    const status = get(e, 'response.status', 0);

    if (status === 401) {
      toast.error('You will need Signin again');
      yield put(actions.loginFailure());
      return history.push('/login');
    }

    if (errors.length > 0) {
      errors.map((error) => toast.error(error));
    } else {
      toast.error('Error in create/update user data');
    }

    yield put(actions.registerFailure());
  }
}

export default all([
  takeLatest(types.LOGIN_REQUEST, loginRequest),
  takeLatest(types.PERSISTE_REHYDRATE, persisteRehydrate),
  takeLatest(types.REGISTER_REQUEST, registerRequest),
]);
