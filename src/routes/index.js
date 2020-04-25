import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import Login from '../pages/Login';
import Student from '../pages/Student';
import Students from '../pages/Students';
import Files from '../pages/Files';
import Register from '../pages/Register';
import Page404 from '../pages/Page404';

export default function Routes() {
  // include tag isPrivate to set router as a not open to everyone
  return (
    <Switch>
      <Route exact path="/" component={Students} isPrivate={false} />
      <Route exact path="/student/:id/edit" component={Student} isPrivate />
      <Route exact path="/student/" component={Student} isPrivate />
      <Route exact path="/files/:id" component={Files} isPrivate />
      <Route exact path="/login/" component={Login} isPrivate={false} />
      <Route exact path="/register/" component={Register} isPrivate={false} />
      <Route path="*" component={Page404} />
    </Switch>
  );
}
