import React, { Component } from 'react';
import { RadialChart } from 'react-vis';
import PropTypes from 'prop-types';
import currencyFormatter from 'currency-formatter';
import CurrencyListItem from './shared/CurrencyListItem';
import FlexContainer from './shared/FlexContainer';

class Portfolio extends Component {
  constructor() {
    super();
    this.updateChart = this.updateChart.bind(this);
  }

  componentDidUpdate() {
    this.updateChart();
  }

  updateChart() {
    const { currencyData, prices } = this.props;
    const defaultChartData = [{ angle: 100, label: 'No data', color: '#f5f5f5' }];
    const chartData = currencyData
      .map((amount, i) => ({
        angle: Math.round(amount.amount * prices[i]),
        label: amount.name,
        color: amount.color,
      }))
      .filter(amount => amount.angle !== 0);
    return chartData.length ? (
      <RadialChart
        colorDomain={[0, 100]}
        colorRange={[0, 10]}
        colorType="literal"
        innerRadius={80}
        radius={120}
        showLabels
        labelsAboveChildren
        data={chartData}
        width={600}
        height={300}
        animation
      />
    ) : (
      <RadialChart
        colorDomain={[0, 100]}
        colorRange={[0, 10]}
        colorType="literal"
        innerRadius={80}
        radius={120}
        showLabels
        labelsAboveChildren
        data={defaultChartData}
        width={600}
        height={300}
        animation
      />
    );
  }

  displayTotalPortfolio() {
    const { currencyData, prices } = this.props;
    return currencyFormatter.format(currencyData.map((a, i) => a.amount * prices[i]).reduce((a, b) => a + b), {
      code: 'USD',
    });
  }

  render() {
    const { currencyData, prices } = this.props;
    return (
      <section className="section">
        <h1 className="title has-text-centered">Total Portfolio: {this.displayTotalPortfolio()}</h1>
        <div>{this.updateChart()}</div>
        <div>
          {currencyData.map((amount, i) => (
            <FlexContainer key={amount.name}>
              <CurrencyListItem {...amount} key={amount.name}>
                {amount.fullName}
              </CurrencyListItem>
              <span>{currencyFormatter.format(amount.amount * prices[i], { code: 'USD' })}</span>
            </FlexContainer>
          ))}
        </div>
      </section>
    );
  }
}

Portfolio.propTypes = {
  currencyData: PropTypes.arrayOf(
    PropTypes.shape({
      amount: PropTypes.number.isRequired,
      fullName: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  prices: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
};

export default Portfolio;
