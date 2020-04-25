import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import * as actions from './actions';
import * as types from '../types';

const request = () =>
  // eslint-disable-next-line no-unused-vars
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 600);
  });

function* exampleRequest() {
  try {
    yield call(request);
    yield put(actions.buttonClickSuccess());
  } catch (e) {
    toast.error('Error during Saga request');
    yield put(actions.buttonClickFailure());
  }
}

export default all([takeLatest(types.BUTTON_CLICK_REQUEST, exampleRequest)]);
