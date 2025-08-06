import { useContext } from 'react';
import AuthContext from './AuthContext';  // No curly braces for default import

const useAuth = () => useContext(AuthContext);

export default useAuth;