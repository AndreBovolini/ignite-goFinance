import React from 'react';
import { categories } from '../../utils/categories';


import {
    Container,
    Title,
    Amount,
    Footer,
    Category,
    Icon,
    CategoryName,
    Date,
} from './styles'



export interface TransactionCardProps {
    name: string;
    amount: string;
    category: string;
    date: string;
    type: 'positive' | 'negative';
}

interface DataTransactionProps {
    data: TransactionCardProps;
}

export function TransactionCard({
    data
} : DataTransactionProps) {

    const category = categories.filter(
        item => item.key === data.category
    )[0]


    return (
        <Container>
            <Title>{data.name}</Title>

            <Amount type={data.type}>
                {data.type === 'negative' && '- '}
                    {data.amount}
            </Amount>

            <Footer>
                <Category>
                    <Icon name={category.icon} />
                    <CategoryName>{category.name}</CategoryName>
                </Category>
                <Date>{data.date}</Date>
            </Footer>
        </Container>
    )
}