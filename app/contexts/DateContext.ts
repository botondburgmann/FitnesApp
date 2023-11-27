import { createContext } from 'react';
import { WeekRange } from '../types and interfaces/types';

const DateContext = createContext<string | null>(null);

export default DateContext;
