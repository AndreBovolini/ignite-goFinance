import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native'

import { Register } from '.';
import { ThemeProvider } from 'styled-components/native';
import theme from '../../global/styles/theme';

const Providers: React.FC = ({ children }) => (
    <ThemeProvider theme={theme}>
        { children }
    </ThemeProvider>
)

describe('register screen', () => {
    it('should open category modal when user press category button', async () => {
        const { getByTestId } = render(
            <Register />, 
            {
                wrapper: Providers
            }
        );

        const categoryModal = getByTestId("modal-category");
        const buttonCategory = getByTestId('button-category');
        fireEvent.press(buttonCategory);

        await waitFor(() => {
            expect(categoryModal.props.visible).toBeTruthy();
        })


    })
})

