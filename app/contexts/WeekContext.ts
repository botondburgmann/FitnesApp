import { createContext } from 'react';
import { WeekRange } from '../types and interfaces/types';

const WeekContext = createContext<WeekRange | null>(null);

export default WeekContext;
