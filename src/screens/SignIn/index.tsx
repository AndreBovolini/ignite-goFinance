import React, { useContext, useState } from 'react'
import { RFValue } from 'react-native-responsive-fontsize'

import AppleSvg from '../../assets/apple.svg'
import GoogleSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import { useAuth } from '../../hooks/auth'

import { SignInSocialButton } from '../../components/SignInSocialButton/index';

import { 
    Container,
    Header,
    TitleWrapper,
    Title,
    SignInTitle,
    Footer,
    ButtonWrapper,
} from './styles'
import { ActivityIndicator, Alert, Platform } from 'react-native'
import { useTheme } from 'styled-components'

export function SignIn() {
    const [isLoading, setIsLoading] = useState(false)

    const { user, signInWithGoogle, signInWithApple} = useAuth()
    const theme = useTheme()
   
    async function handleSignInWithGoogle() {
        try {
            setIsLoading(true)
            return await signInWithGoogle();
        } catch (error) {
            console.warn(error)
            Alert.alert('não foi possivel conectar'+error)
            setIsLoading(false)
        } 
    }

    async function handleSignInWithApple() {
        try {
            setIsLoading(true)
            return await signInWithApple();
        } catch (error) {
            console.warn(error)
            Alert.alert('não foi possivel conectar'+error)
            setIsLoading(false)
        }
    }

    return (
        <Container>
            <Header>
                <TitleWrapper>
                    <LogoSvg 
                        width={RFValue(120)}
                        height={RFValue(68)}
                    />

                    <Title>
                    Controle suas {'\n'}
                    finanças de forma {'\n'}
                    muito simples
                    </Title>
                </TitleWrapper>

                <SignInTitle>
                Faça seu login com {'\n'}
                uma das contas abaixo
                </SignInTitle>
            </Header>

            <Footer>
                <ButtonWrapper>
                    <SignInSocialButton 
                    title={"Entrar com Google"}
                    svg={GoogleSvg}
                    onPress={handleSignInWithGoogle}
                    />
                    { Platform.OS === 'ios' ?
                    <SignInSocialButton 
                    title={"Entrar com Apple ID"}
                    svg={AppleSvg}
                    onPress={handleSignInWithApple}
                    />
                    : null}
                </ButtonWrapper>

                { isLoading && <ActivityIndicator color={theme.colors.shape} style={{marginTop: 18}} />}
            </Footer>
        </Container>
    )
}