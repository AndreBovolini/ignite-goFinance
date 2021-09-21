import React from 'react';

import { render } from '@testing-library/react-native';

import { Input } from '.'
import {  ThemeProvider } from 'styled-components/native'
import theme from '../../../global/styles/theme'

const Providers: React.FC = ({ children }) => (
    <ThemeProvider theme={theme}>
        { children }
    </ThemeProvider>
)

describe('Input Component', () => {
    it('should have specified border when active', () => {
        const { getByTestId } = render(
        <Input
         active={true} 
         testID="input-email" 
         placeholder="E-mail"
         keyboardType="email-address"
         autoCorrect={false}
         />,
         {
             wrapper: Providers
         }
         );

         const inputComponent = getByTestId('input-email');
         expect(inputComponent.props.style[0].borderColor).toEqual('#e83f5b')
         expect(inputComponent.props.style[0].borderWidth).toEqual(3)

    })
})