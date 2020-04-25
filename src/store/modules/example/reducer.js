import * as types from '../types';

const initialState = {
  buttonClicked: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case types.BUTTON_CLICK_SUCCES: {
      const newState = { ...state };
      newState.buttonClicked = !newState.buttonClicked;
      console.log('success', newState);
      return newState;
    }

    case types.BUTTON_CLICK_FAILURE: {
      console.log('failure');
      return state;
    }

    case types.BUTTON_CLICK_REQUEST: {
      console.log('waiting for request');
      return state;
    }

    default: {
      return state;
    }
  }
}
