module.exports = {

    tradeEnum : {
        KLINE_INTERVAL_1MINUTE: '1m',
        KLINE_INTERVAL_3MINUTE: '3m',
        KLINE_INTERVAL_5MINUTE: '5m',
        KLINE_INTERVAL_15MINUTE: '15m',
        KLINE_INTERVAL_30MINUTE: '30m',
        KLINE_INTERVAL_1HOUR: '1h',
        KLINE_INTERVAL_2HOUR: '2h',
        KLINE_INTERVAL_4HOUR: '4h',
        KLINE_INTERVAL_6HOUR: '6h',
        KLINE_INTERVAL_8HOUR: '8h',
        KLINE_INTERVAL_12HOUR: '12h',
        KLINE_INTERVAL_1DAY: '1d',
        KLINE_INTERVAL_3DAY: '3d',
        KLINE_INTERVAL_1WEEK: '1w',
        KLINE_INTERVAL_1MONTH: '1M',
    },
    emaCalculator(tradeData)
    {      
        let closingPrice=[]
        for(let i=0; i< tradeData.length; ++i)
        {
            closingPrice.push(parseFloat(tradeData[i][4]))
        }
        console.log(closingPrice)
        console.log('current ema in period 5')
        let ema5=this.exponentialMovingAverage(closingPrice,5);
        console.log(ema5[ema5.length-1])
        console.log('current ema in period 10');
        let ema10=this.exponentialMovingAverage(closingPrice,10);
        console.log(ema10[ema10.length-1])
    },
    exponentialMovingAverage(prices, window) {
        if (!prices || prices.length < window) {
          return [];
        }
      
        let index = window - 1;
        let previousEmaIndex = 0;
        const length = prices.length;
        const smoothingFactor = 2 / (window + 1);
      
        const exponentialMovingAverages = [];
      
        const [sma] = this.simpleMovingAverage(prices, window, 1);
        exponentialMovingAverages.push(sma);
      
        while (++index < length) {
          const value = prices[index];
          const previousEma = exponentialMovingAverages[previousEmaIndex++];
          const currentEma = (value - previousEma) * smoothingFactor + previousEma;
          exponentialMovingAverages.push(currentEma);
        }
      
        return exponentialMovingAverages;
      },
      simpleMovingAverage(prices, window, n = Infinity) {
        if (!prices || prices.length < window) {
          return [];
        }
      
        let index = window - 1;
        const length = prices.length + 1;
      
        const simpleMovingAverages = [];
      
        let numberOfSMAsCalculated = 0;
      
        while (++index < length && numberOfSMAsCalculated++ < n) {
          const windowSlice = prices.slice(index - window, index);
          const sum = windowSlice.reduce((prev, curr) => prev + curr, 0);
          simpleMovingAverages.push(sum / window);
        }
      
        return simpleMovingAverages;
      }
}