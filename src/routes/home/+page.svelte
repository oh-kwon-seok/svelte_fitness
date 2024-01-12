

<script lang="ts">
	// @ts-nocheck
    import '../../app.postcss';
    

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    
	import food_url from '$lib/images/food.jpg';

    

    import { Tabs, TabItem, Timeline, TimelineItem, Button,Popover ,Card } from 'flowbite-svelte';

    import Util from '$lib/components/modal/user_order/Util.svelte';


    import NotFound from '$lib/components/error/404.svelte';

    import ServerError from '$lib/components/error/500.svelte';

    import {url_state,cookie_state,common_product_state,table_state} from '$lib/store/common/state';
    import {makeTable,infoCallApi} from '$lib/store/common/function';

    import {userOrderModalOpen} from '$lib/store/user_order/function';

	import { afterUpdate, onMount } from 'svelte';

  
    // import {TabulatorFull as Tabulator} from 'tabulator-tables';
    import * as Icon from 'svelte-awesome-icons';
    

	import moment from 'moment';

  
    export let data;
  
    import {user_order_modal_state} from '$lib/store/user_order/state';


   

    </script>
        <style>
          @import 'tabulator-tables/dist/css/tabulator_modern.min.css';
       
          /* 나머지 스타일 정의 */
        </style>
    


        <Header />
      
        
          <Card img={food_url}  class="mb-4 h-screen text-center">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">식자재 유통 서비스</h5>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">아래 버튼으로 확인할 수 있습니다.</p>
              <Button class="m-3"color="blue" on:click={() => {userOrderModalOpen('','add')}}>
                주문하기
              </Button>
              <Button color="primary" on:click={() => window.location.href = '/sale/user_order_sub'}>
                주문현황
              </Button >
               <Footer />
          </Card>

                  {#if $user_order_modal_state['title'] === 'add'}
                  <Util title="add" />
                {:else if $user_order_modal_state['title'] === 'update'}
                  <Util  title="update"/>
                  {:else if $user_order_modal_state['title'] === 'check_delete'}
                  <Util  title="check_delete"/>
                {/if}



                
            
          