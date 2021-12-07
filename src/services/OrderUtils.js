//Core
import { useQuery, useMutation, useQueryClient } from 'react-query';

//Components
import OrderService from './OrderService';

function useGetPhotographer(id) {
  const service = OrderService();
  let success = true;
  const photographerId = Number(id);
  const enabledOption = photographerId > 0;
  const result = useQuery(
    ['photographer-data', photographerId],
    async () => {
      const resp = await service.GetPhotographer(photographerId).then(
        (res) => res.data,
        (err) => {
          success = false;
          return err;
        }
      );
      if (!success) {
        throw new Error(resp);
      }

      return resp;
    },
    {
      enabled: enabledOption,
    }
  );
  return { ...result };
}

export { useGetPhotographer };
