
import type { PageLoad } from './$types';

//@ts-ignore
import { cookie_state } from '$lib/store/common/state';





export const load = ({ url }) => {
  // URL에서 쿼리 파라미터 'userId'를 가져옴
  const userId = url.searchParams.get('userId');
  
  // 여기서 userId에 맞는 데이터를 로드하거나 추가 작업을 할 수 있음
  console.log('Received userId:', userId);

  return { userId };
};