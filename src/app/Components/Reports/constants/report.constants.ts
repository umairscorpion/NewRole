export const ReportConstant = {
  DailyReport: {
    Chart: {
      Options: {
        fillText: 343,
        responsive: true,
        cutoutPercentage: 80,
        legend: {
          position: 'bottom'
        },
        plugins: {
          datalabels: {
            display: false,
            color: 'white'
          },
        },
        elements: {
          center: {
            text: '0',
            color: '#36A2EB',
            fontStyle: 'Helvetica',
            sidePadding: 15
          }
        }
      },
      Colors: {
        AbsenceSummary: [
          {
            backgroundColor: ['#77c498', '#73dad9', '#b1ddc4'], // Filled, Un-Filled, No Sub Required
            borderColor: '#f2ca97'
          }
        ],
        Total: [{
          backgroundColor: '#0da0b2',
          borderColor: '#09666e',
        }],
        Filled: [
          {
            backgroundColor: ['#ffffff', '#77c498'], // Total, Filled
            borderColor: '#468d67',
          }
        ],
        unFilled: [
          {
            backgroundColor: ['#ffffff', '#73dad9'], // Total, Un-Filled
            borderColor: '#73b7b6',
          }
        ],
        NoSubReq: [
          {
            backgroundColor: ['#ffffff', '#b1ddc4'], // Total, No Sub Required
            borderColor: '#73b7b6',
          }
        ]
      }
    }
  }
};
