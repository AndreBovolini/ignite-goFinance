import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native'

import { 
    Container, 
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionsList,
    LogoutButton,
    LoadContainer
      } from './styles'
import { RFValue } from 'react-native-responsive-fontsize';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';

export interface DataListProps extends TransactionCardProps {
    id: string;
}
interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expenses: HighlightProps;
    total: HighlightProps
}

export function Dashboard(){
    const [isLoading, setIsLoading] = useState(true)
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData)

    const theme = useTheme();
    const { signOut, user } = useAuth()

function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative') {
    const  collectionFiltered = collection
    .filter((transaction) => transaction.type === type)   

    if (collectionFiltered.length === 0)   return 0
    
    let lastTransactions = 
        new Date(
        Math.max.apply(Math, collectionFiltered
            .map((transaction) => new Date(transaction.date).getTime())));
            console.warn(lastTransactions)
        
        return `${lastTransactions.getDay()} de ${lastTransactions.toLocaleString('pt-BR', {month: 'long'})}`


    }

    async function loadTransaction() {
        const dataKey = `@gofinance:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey)

        const transactions = response ? JSON.parse(response) : []

        let entriesTotal = 0;
        let expenseTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {


            if (item.type === 'positive') {
                entriesTotal += Number(item.amount)
            } else {
                expenseTotal += Number(item.amount)
            }

            const amount = Number(item.amount).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            })
            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date))

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date
            }
        })
        const total = entriesTotal - expenseTotal
        setTransactions(transactionsFormatted);

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpenses = getLastTransactionDate(transactions, 'negative');
        const totalInterval = lastTransactionExpenses === 0 ? 'N??o h?? transa????es' : `01 ?? ${lastTransactionExpenses}`

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionEntries === 0 ? 'N??o h?? trasa????es':`??ltima entrada dia ${lastTransactionEntries}`
            },
            expenses: {
                amount: expenseTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionExpenses === 0 ? 'N??o h?? trasa????es':`??ltima sa??da dia ${lastTransactionExpenses}`
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval
            }
        })
        setIsLoading(false)
    }

    useEffect(() => {
        loadTransaction();

    }, [])

    useFocusEffect(useCallback(() => {
        loadTransaction();
    }, []))


    return (
        <Container>
            
            { 
            isLoading ? 
            <LoadContainer>
                <ActivityIndicator color={theme.colors.primary} size={'large'}/>
            </LoadContainer>
             :
            <>
            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: user.photo }}/>
                        <User>
                            <UserGreeting>Ol??,</UserGreeting>
                            <UserName>{user.name}</UserName>
                        </User>
                    </UserInfo>
                    <LogoutButton onPress={signOut}>
                        <Icon name="power" />
                    </LogoutButton>
                    </UserWrapper>
                    
                </Header>
                <HighlightCards
                
                >
                <HighlightCard title="Entradas" amount={highlightData.entries.amount} lastTransaction={highlightData.entries.lastTransaction} type="up"/>
                <HighlightCard title="Sa??das" amount={highlightData.expenses.amount} lastTransaction={highlightData.expenses.lastTransaction} type="down"/>
                <HighlightCard title="Total" amount={highlightData.total.amount} lastTransaction={highlightData.total.lastTransaction}  type="total"/>
                </HighlightCards>

            <Transactions>
                <Title>Listagem</Title>
                <TransactionsList 
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={( {item }) => <TransactionCard data={item} />}
                />

            </Transactions>
            </>
            }
        </Container>
    )
}
