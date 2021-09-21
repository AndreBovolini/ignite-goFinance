import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native'

import { Modal, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import { Button } from '../../components/Form/Button';
import { Container,
    Header, Title, Form, Fields, TransactionsTypes
} from './styles';
import { InputForm } from '../../components/Form/InputForm';

import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';

import { CategorySelect } from '../CategorySelect/index';
import { useAuth } from '../../hooks/auth';

interface FormData {
    name: string;
    amount: string;
}

const schema = Yup.object().shape({
    name: Yup.string().required('Nome é obrigatório'),
    amount: Yup.number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório')
})

 
export function Register(props) {
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalShow, setCategoryModalShow] = useState(false);

    const { user } = useAuth();

    

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria',
    })

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    // const navigation = useNavigation();

    function handleTransactionTypeSelect(type: "positive" | "negative"){
        setTransactionType(type)
    }

    function handleCloseSelectCategoryModal() {
        setCategoryModalShow(false);
    }

    function handleOpenSelectCategoryModal() {
        setCategoryModalShow(true);
    }

    async function handleRegister(form: FormData) {
        const dataKey = `@gofinance:transactions_user:${user.id}`;
        if (!transactionType) {
            return Alert.alert('Selecione o tipo da transação');
        }

        if (category.key === 'category') {
            return Alert.alert('Selecione a categoria');
        }

        const newTransaction = {
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            type: transactionType,
            category: category.key,
            date: new Date(),
        }
        
        try {
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : []

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted))


            reset()
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria',
            });

            props.navigation.navigate('Listagem');

        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível salvar")
        }
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
            
            <Header>
                <Title>Cadastro</Title>
            </Header>
            <Form>
            <Fields>
            <InputForm
            placeholder="nome"
            control={control}
            name='name'
            autoCapitalize="sentences"
            autoCorrect={false}
            error={errors.name && errors.name.message}
            />
            <InputForm
            placeholder="Preço"
            control={control}
            name='amount'
            keyboardType="numeric"
            error={errors.amount && errors.amount.message}
            />
            <TransactionsTypes>
                <TransactionTypeButton type="up" title="Income" onPress={() => handleTransactionTypeSelect('positive')}
                isActive={transactionType === "positive" ? true :  false}
                />
                <TransactionTypeButton type="down" title="Outcome" 
                onPress={() => handleTransactionTypeSelect('negative')}
                isActive={transactionType === "negative" ? true :  false}
                />
            </TransactionsTypes>

            <CategorySelectButton title={category.name} onPress={handleOpenSelectCategoryModal} testID="button-category"/>
            </Fields>

            

            <Button 
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
            />
            </Form>

            <Modal testID="modal-category"visible={categoryModalShow}>
                <CategorySelect 
                category={category}
                setCategory={setCategory}
                closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>
        
        </Container>
        </TouchableWithoutFeedback>
    )
}