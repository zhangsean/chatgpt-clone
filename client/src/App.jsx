import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Root from './routes/Root';
import Chat from './routes/Chat';
import Login from './routes/Login';
import Search from './routes/Search';
import store from './store';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { ScreenshotProvider } from './utils/screenshotContext.jsx';
import { useGetSearchEnabledQuery, useGetUserQuery, useGetEndpointsQuery, useGetPresetsQuery } from '~/data-provider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to="/login"
            replace={true}
          />
        )
      },
      {
        path: 'chat/:conversationId?',
        element: <Chat />
      },
      {
        path: 'search/:query?',
        element: <Search />
      }
    ]
  }
]);

const App = () => {
  const [user, setUser] = useRecoilState(store.user);
  const setIsSearchEnabled = useSetRecoilState(store.isSearchEnabled);
  const setEndpointsConfig = useSetRecoilState(store.endpointsConfig);
  const setPresets = useSetRecoilState(store.presets);

  const searchEnabledQuery = useGetSearchEnabledQuery();
  const userQuery = useGetUserQuery();
  const endpointsQuery = useGetEndpointsQuery();
  const presetsQuery = useGetPresetsQuery();

  const pathname = location.pathname;
  const isLoginPath = pathname == '/login';
  console.debug(pathname, isLoginPath);
  useEffect(() => {
    if (endpointsQuery.data) {
      setEndpointsConfig(endpointsQuery.data);
    } else if (endpointsQuery.isError && !isLoginPath) {
      console.error("Failed to get endpoints", endpointsQuery.error);
      window.location.href = '/login';
    }
  }, [endpointsQuery.data, endpointsQuery.isError]);

  useEffect(() => {
    if (presetsQuery.data) {
      setPresets(presetsQuery.data);
    } else if (presetsQuery.isError && !isLoginPath) {
      console.error("Failed to get presets", presetsQuery.error);
      window.location.href = '/login';
    }
  }, [presetsQuery.data, presetsQuery.isError]);

  useEffect(() => {
    if (searchEnabledQuery.data) {
      setIsSearchEnabled(searchEnabledQuery.data);
    } else if (searchEnabledQuery.isError && !isLoginPath) {
      console.error("Failed to get search enabled", searchEnabledQuery.error);
    }
  }, [searchEnabledQuery.data, searchEnabledQuery.isError]);

  useEffect(() => {
    if (userQuery.data) {
      setUser(userQuery.data);
    } else if (userQuery.isError && !isLoginPath) {
      console.error("Failed to get user", userQuery.error);
      window.location.href = '/login';
    }
  }, [userQuery.data, userQuery.isError]);

  if (user)
    return (
      <>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </>
    );
  else
    return (<>
      <RouterProvider router={router} />
    </>)
};

export default () => (
  <ScreenshotProvider>
    <App />
  </ScreenshotProvider>
);
