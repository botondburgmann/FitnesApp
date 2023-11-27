import { createContext } from 'react';

const UserContext = createContext<string | null>(null);

export default UserContext;
