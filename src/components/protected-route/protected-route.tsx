import { FC, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../src/services/store';
import {
  fetchGetUser,
  selectUser
} from '../../../src/services/slices/userSlice';
import { Preloader } from '../ui/preloader';

interface ProtectedRouteProps {
  children: React.ReactElement;
  nonAuthenticatedOnly?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  nonAuthenticatedOnly = false,
  children
}) => {
  const user = useSelector(selectUser);
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) dispatch(fetchGetUser());
  }, []);
  if (user.isLoading) return <Preloader />;
  else if (nonAuthenticatedOnly && user.name) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} />;
  } else if (nonAuthenticatedOnly && !user.name) return <>{children}</>;
  else if (!user.name || !user.email) return <Navigate to='/login' />;
  else return <>{children}</>;
};
