import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native'
import { HistoryCard } from '../../components/HistoryCard';
import { VictoryPie } from 'victory-native'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import AsyncStorage from '@react-native-async-storage/async-storage';

import { Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectIcon,
    MonthSelectButton,
    Month,
    LoadContainer
 } from './styles';
import { categories } from '../../utils/categories';
import { ScrollView } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/auth';


export interface TransactionData {
    id: string;
    name: string;
    amount: string;
    category: string;
    date: string;
    type: 'positive' | 'negative';
}

interface CategoryData {
    name: string;
    key: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: number;
    percentFormatted: string;
}


export function Resume() {
    const [isLoading, setIsLoading] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])

    const theme = useTheme();
    const { user } = useAuth();

    function handleChangeDate(action: 'next' | 'prev') {
        
        if(action === 'next') {
            const nextDate = addMonths(selectedDate, 1)
            setSelectedDate(nextDate)
        } else {
            const prevDate = subMonths(selectedDate, 1)
            setSelectedDate(prevDate)
        }
    }

    async function loadData() {
        setIsLoading(true);
        const dataKey = `@gofinance:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey)
        const responseFormatted = response ? JSON.parse(response) : []

       

        const expenses = responseFormatted
        .filter((expense : TransactionData)  => 
        expense.type === 'negative' &&
        new Date(expense.date).getMonth() === selectedDate.getMonth() &&
        new Date(expense.date).getFullYear() === selectedDate.getFullYear()
        );

        const expensesTotal = expenses
        .reduce((accumulator: number, expense: TransactionData) => {
            return accumulator + Number(expense.amount)
        }, 0)

        const totalByCategory: CategoryData[] = [];

        categories.forEach(category => {
            let categorySum = 0;

            expenses.forEach((expense : TransactionData) => {
                if(expense.category === category.key) {
                    categorySum += Number(expense.amount)
                }
            });

            if (categorySum > 0) {

                const total = categorySum.toLocaleString('pt-BR',{
                    style: 'currency',
                    currency: 'BRL'
                })

                const percent = (categorySum / expensesTotal * 100);
                const percentFormatted = `${percent.toFixed(0)}%`;

                totalByCategory.push({
                    name: category.name,
                    total: categorySum,
                    totalFormatted: total,
                    key: category.key,
                    color: category.color,
                    percent,
                    percentFormatted,
                })
            }
        })

        setTotalByCategories(totalByCategory)
        setIsLoading(false)
    }


    
    useFocusEffect(useCallback(() => {
        loadData();
    }, [selectedDate]))


    return (
        <Container>

           
                    <Header>
                        <Title>Resumo por Categoria</Title>
                    </Header>
                    { 
            isLoading ? 
            <LoadContainer>
                <ActivityIndicator color={theme.colors.primary} size={'large'}/>
            </LoadContainer>
             :
           
                <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingBottom: useBottomTabBarHeight()
                    }}
                >


                    <MonthSelect>
                        <MonthSelectButton onPress={() => handleChangeDate('prev')}>
                            <MonthSelectIcon name="chevron-left"/>
                        </MonthSelectButton>

                        <Month>
                            { format(selectedDate, 'MMMM, yyyy', {locale: ptBR})}
                        </Month>

                        <MonthSelectButton onPress={() => handleChangeDate('next')}>
                            <MonthSelectIcon  name="chevron-right"/>
                        </MonthSelectButton>
                    </MonthSelect>
                    <ChartContainer>
                    <VictoryPie 
                        data={totalByCategories}
                        x="percentFormatted"
                        y="total"
                        colorScale={totalByCategories.map(category => category.color)}
                        style={{
                            labels: { 
                                fontSize: RFValue(18),
                                fontWeight: 'bold',
                                fill: theme.colors.shape,
                            }
                        }}
                        labelRadius={50}
                    />
                    </ChartContainer>
                    {
                        totalByCategories.map(item => (
                            <HistoryCard 
                                title={item.name}
                                amount={item.totalFormatted}
                                color={item.color}
                                key={item.key}
                            />
                        ))
                    }
                </Content>

        }
        </Container>
    )
}