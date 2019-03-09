
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
        elements: {
          center: {
            text: 'Desktop',
            color: '#36A2EB',
            fontStyle: 'Helvetica',
            sidePadding: 15
          }
        }
      },
      Colors: {
        AbsenceSummary: [
          {
            backgroundColor: '#fce1c4', // Filled
            borderColor: '#f2ca97'
          },
          {
            backgroundColor: '#73dad9', // UnFilled
            borderColor: '#73b7b6',
          },
          {
            backgroundColor: '#b1ddc4 ', // No Sub Required
            borderColor: '#99c6b1',
          }
        ],

        Total: {
          backgroundColor: '#0da0b2',
          borderColor: '#09666e',
        },
        Filled: [
          {
            backgroundColor: '#fce1c4', // Filled
            borderColor: '#f2ca97'
          },
          {
            backgroundColor: '#73dad9', // UnFilled
            borderColor: '#73b7b6',
          }
        ],
        unFilled: [
          {
            backgroundColor: '#73dad9', // UnFilled
            borderColor: '#73b7b6',
          },
          {
            backgroundColor: '#ffa5b6',
            borderColor: '#efefef',
          }
        ],
        NoSubReq: [
          {
            backgroundColor: '#b1ddc4 ', // No Sub Required
            borderColor: '#99c6b1',
          },
          {
            backgroundColor: '#ffa5b6',
            borderColor: '#efefef',
          },
          {
            backgroundColor: '#12A2FE',
            borderColor: '#efefef',
          }]
      }
    }
  }
};
