import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';

const Home = lazy(() => import('pages/home/HomePage'));
const Login = lazy(() => import('pages/login/LoginPage'));
const NotFound = lazy(() => import('pages/not-found/404'));

const Routes = () => (
  <Suspense fallback={<div />}>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/login" exact component={Login} />
      { /* 404 page. nothing should be added below this route */ }
      <Route component={NotFound} />
    </Switch>
  </Suspense>
);

export default Routes;
