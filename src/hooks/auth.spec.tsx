import { renderHook, act } from '@testing-library/react-hooks'
import { logInAsync } from 'expo-google-app-auth'
import { mocked } from 'ts-jest/utils'
import { AuthProvider, useAuth } from './auth'

jest.mock('expo-google-app-auth');

describe('Auth Hook', () => {
    it('should be able to sign in with google account', async () => {

        const googleMocked = mocked(logInAsync as any);
        googleMocked.mockReturnValueOnce({
            type: 'success',
            user: {
                id: 'any_id',
                email: 'bovoliniandre@gmail.com',
                name: 'André Bovolini',
                photo: 'any_photo.png'
            }
        })


        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        })

        await act(() => result.current.signInWithGoogle())

        expect(result.current.user.email).toBe('bovoliniandre@gmail.com');

    })
    it('user should not connect if cancel authentication with google', async () => {

        const googleMocked = mocked(logInAsync as any);
        googleMocked.mockReturnValueOnce({
            type: 'cancel',
        })


        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        })

        await act(() => result.current.signInWithGoogle())

        expect(result.current.user).not.toHaveProperty('id')

    })

    it('should show error in signin with google if it not return type', async () => {



        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider
        })

       try {
        await act(() => result.current.signInWithGoogle())
       } catch {
            expect(result.current.user).toEqual({})

       }


    })
})