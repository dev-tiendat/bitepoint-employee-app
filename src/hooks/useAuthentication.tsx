import { isEmpty } from 'lodash';
import { useMemo } from 'react';
import { useAppSelector } from 'store/hooks';
import { selectUserInfo } from 'store/user/userSelector';

const useAuthentication = () => {
  const user = useAppSelector(selectUserInfo);
  const isAuthenticated = useMemo(
    () => !isEmpty(user.tokens?.accessToken),
    [user],
  );

  return { user, isAuthenticated };
};

export default useAuthentication;
