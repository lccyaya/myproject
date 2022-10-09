import { checkPhone } from '@/utils/utils';
export const PHONE_RULE = (formatMessage) => [
  {
    validator: (rule, value) => {
      return new Promise((resolve, reject) => {
        if (!value || value.split('-').filter((e) => e).length <= 1) {
          reject(formatMessage({ id: 'key_this_is_required' }));
        } else if (checkPhone(value)) {
          resolve(true);
        } else {
          reject(formatMessage({ id: 'key_invalid_phone_number' }));
        }
      });
    },
  },
];
