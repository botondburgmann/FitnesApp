    import { NavigationProp } from '@react-navigation/native';
    import React, { createContext } from 'react';

    const NavigationContext = createContext<NavigationProp<any, any>>(null);

    export default NavigationContext;


