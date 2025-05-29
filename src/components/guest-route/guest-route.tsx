import { FC, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../src/services/store';
import {
  fetchGetUser,
  selectUser
} from '../../../src/services/slices/userSlice';
import { Preloader } from '../ui/preloader';

type GuestRouteProps = {
  children: React.ReactElement;
};

export const GuestRoute: FC<GuestRouteProps> = ({
  children
}: GuestRouteProps) => {
  const user = useSelector(selectUser);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) dispatch(fetchGetUser());
  }, []);

  if (user.isLoading) return <Preloader />;
  else if (!(!user.name && !user.email)) return <Navigate to='/' />;
  else return <>{children}</>;
};
