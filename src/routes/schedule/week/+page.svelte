
<script lang="ts">
	// @ts-nocheck
    import axios from 'axios';
    import moment from 'moment';
	import {common_week_schedule_state,url_state} from '$lib/store/common/state';
    import { onMount,afterUpdate } from 'svelte';

	    
    import {selectWeekScheduleQuery} from '$lib/store/common/function';
     // SvelteKit이 load 함수에서 반환한 값을 data로 받습니다.
     export let data: { userId: string };

// data.userId를 통해 값을 사용
    let userId = data.userId;
    

    // 회원 데이터 타입 정의
    type Member = {
        uid: number;
        name: string;
    };

   
    let currentWeekDates: string[] = [];

    // 회원 데이터를 저장할 배열
    let memberData: Member[] = [];

    // 로그인한 사용자 ID를 받아오기 위한 변수
    
    // API 엔드포인트
    const api = "http://172.20.10.4:8081";

    // 이번 주 스케줄 데이터를 불러오기 위한 함수
    

    // 시간대 생성 함수 (6시~22시)
    function generateTimes(): string[] {
        const times: string[] = [];
        for (let i = 6; i <= 23; i++) {
            const timeString = `${i < 10 ? '0' + i : i}:00`;
            times.push(timeString);
        }
        return times;
    }

    const times: string[] = generateTimes();

    // member_uid를 사용해 회원 이름을 반환하는 함수
    function getMemberName(member_uid: number): string {
        const member = memberData.find(m => m.uid === member_uid);
        return member ? member.name : '알 수 없음';
    }

    // 스케줄 데이터를 필터링하여 해당 시간과 날짜에 맞는 데이터가 있는지 확인
    function getScheduleForTimeAndDate(date: any, time: any) {
		
		
        return $common_week_schedule_state.find(s => s.edu_date === date && s.edu_time === time.replace(':', '') + '00');
    }

    // 페이지 로드 시 호출 (스케줄 데이터 및 회원 데이터 로드)
    onMount(() => {
        
   
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    
    
            selectWeekScheduleQuery(userId); // API 요청으로 이번 주 스케줄 데이터 불러오기
    
            // 이번 주 날짜 목록 (월~일)
            const startOfWeek = moment().startOf('week').add(1, 'days');
            const endOfWeek = moment().endOf('week').add(1, 'days');
    
            currentWeekDates = [
                startOfWeek.format('YYYY-MM-DD'),
                startOfWeek.add(1, 'days').format('YYYY-MM-DD'),
                startOfWeek.add(1, 'days').format('YYYY-MM-DD'),
                startOfWeek.add(1, 'days').format('YYYY-MM-DD'),
                startOfWeek.add(1, 'days').format('YYYY-MM-DD'),
                startOfWeek.add(1, 'days').format('YYYY-MM-DD'),
                endOfWeek.format('YYYY-MM-DD'),
            ];
        });

   
</script>

<style>
    .table-header {
        background-color: #f3f4f6;
        color: #1f2937;
    }
    .full-screen {
        min-height: 100vh; /* 화면을 꽉 채움 */
    }
</style>

<!-- 화면을 꽉 채운 스케줄 테이블 -->
<div class="full-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-full w-full space-y-8">
        <div class="text-center">
            <h2 class="text-3xl font-extrabold text-gray-900">이번 주 스케줄</h2>
        </div>

        <!-- 스케줄 테이블 -->
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="table-header">
                    <tr>
                        <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시간</th>
                        {#each currentWeekDates as date}
                            <th class="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{date}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    {#each times as time}
                        <tr>
                            <td class="py-4 px-6 text-sm font-medium text-gray-900">{time}</td>
                            {#each currentWeekDates as date}
                                <td class="py-4 px-6 text-sm font-medium text-gray-500">

									{#if $common_week_schedule_state &&  $common_week_schedule_state.length > 0}
										
									
											{#each $common_week_schedule_state as schedule (schedule.uid)}
											
							
											{#if schedule.eduDate === date && schedule.eduTime === time.replace(':', '') }
													{schedule.memberName} 
												{/if}
											
											{/each}
										{:else}
											<span>-</span>
										
									{/if}
                                </td>
                            {/each}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
        <div>
            <!-- 광고 슬롯 -->
 <!-- 웹광고 -->
 <ins class="adsbygoogle"
      style="display:block"
      data-ad-client="ca-pub-2691614403272396"
      data-ad-slot="5371183155"
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
            
           </div>
    </div>
</div>
