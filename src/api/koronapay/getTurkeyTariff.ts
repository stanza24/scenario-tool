import { koronaPayApi } from './api';

export const getTurkeyTariff = () =>
  koronaPayApi
    .get(
      'transfers/online/api/transfers/tariffs' +
        new URLSearchParams({
          sendingCountryId: 'RUS',
          sendingCurrencyId: '810',
          receivingCountryId: 'TUR',
          receivingCurrencyId: '840',
          paymentMethod: 'debitCard',
          receivingAmount: '55500',
          receivingMethod: 'cash',
          paidNotificationEnabled: 'false',
        })
    )
    .then((v) => {
      console.log(v);
      return v;
    });
