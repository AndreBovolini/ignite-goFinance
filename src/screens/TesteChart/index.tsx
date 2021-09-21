import React from 'react'

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { ECharts } from "react-native-echarts-wrapper";

import {
    Container,
    Header,
    Title,
    Content,
    ChartContainer
} from './styles'

export function TesteChart() {

    const option = {
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line"
          }
        ]
      };
    return (
        <Container>
            <Header>
                        <Title>Resumo por Categoria</Title>
            </Header>
            <Content
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 24,
                        paddingBottom: useBottomTabBarHeight()
                    }}
            >

                    <ChartContainer style={{flex: 1}}>
                    <ECharts
                        option={option}
                        backgroundColor="rgba(93, 169, 81, 0.3)"
                    />
                    </ChartContainer>

            </Content>

        </Container>
    )
}

