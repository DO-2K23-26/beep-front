import { Route, Routes } from 'react-router-dom';
import { ROUTER_AUTH } from './router';

export function PageAuth() {
  return (
    <Routes>
      {ROUTER_AUTH.map((route) => (
        <Route key={route.path} path={route.path} element={route.component} />
      ))}
    </Routes>
  );
}
