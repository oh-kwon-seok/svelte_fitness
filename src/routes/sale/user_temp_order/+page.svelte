

<script>
	
    // @ts-nocheck
    import '../../../app.postcss';

    import Header from '$lib/components/layout/Header.svelte';
    import SideBar from '$lib/components/layout/SideBar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import Title from '$lib/components/layout/Title.svelte';
    

    import { Tabs, TabItem, Timeline, TimelineItem, Button,ButtonGroup,Dropdown,DropdownItem,Input,Label,Select,Search,Card,Listgroup,Avatar} from 'flowbite-svelte';
    import { ChevronDownSolid, SearchOutline } from 'flowbite-svelte-icons';


    import Util from '$lib/components/modal/user_order/Util.svelte';
    

    import * as Icon from 'svelte-awesome-icons';

    import {userOrderModalOpen} from '$lib/store/user_order/function';
    import {excelDownload, excelUpload, fileButtonClick} from '$lib/store/common/function';
    
    

    import {url_state,cookie_state,common_user_order_sub_state,table_state,common_toast_state,common_search_state} from '$lib/store/common/state';
    import {TABLE_COMPONENT,EXCEL_CONFIG} from '$lib/module/common/constants';

    import SearchBar from '$lib/components/layout/SearchBar.svelte'
    import Toast from '$lib/components/toast/Toast.svelte'
    
    import {selectCardQuery} from '$lib/store/common/function';

    import {userOrderSubexcelDownload} from '$lib/store/user_order_sub/function';
    import food_url from '$lib/images/food.jpg';


	import { afterUpdate, onMount } from 'svelte';

  
    // import {TabulatorFull as Tabulator} from 'tabulator-tables';


	import moment from 'moment';
            
  
    export let data;




    onMount(()=>{
     
      selectCardQuery('user_temp_order_sub','mobile_select');
       
      
    });

    afterUpdate(()=> {

        if(data.title === 'redirect'){
            window.location.href = '/';
            alert('잘못된 주소거나 요청시간이 만료되었습니다.');
        }else if($url_state['path'] === '/user_temp_order'){
         
          selectCardQuery('user_temp_order_sub','mobile_select');
     }
      
    })
     
 

 

    </script>
        <style>
          @import 'tabulator-tables/dist/css/tabulator_modern.min.css';
       
          /* 나머지 스타일 정의 */
        </style>
        
        
        

        
     
        <Header />

        <Card img={food_url}  class="mb-4 h-screen text-center">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">장바구니 현황</h5>
          <SearchBar title="user_temp_order_sub" label="등록일자"/>    


            {#if $common_user_order_sub_state && $common_user_order_sub_state.length > 0}
          <Listgroup items={$common_user_order_sub_state} let:item class="border-0 dark:!bg-transparent">
            <div class="flex items-center space-x-4 rtl:space-x-reverse">
              <!-- <Avatar src={item.img.src} alt={item.img.alt} class="flex-shrink-0" /> -->
              <Icon.BasketShoppingSolid class='mr-2' size="20" />
              <div class="flex-1 min-w-0">
                <p class="whitespace-normal text-sm font-medium text-gray-900 truncate dark:text-white">
                  {item['product']['name']}
                </p>
                <p class="text-sm text-gray-500 truncate dark:text-gray-400">
                  {moment(item['created']).format('YY-MM-DD')} 
                </p>
              </div>
              <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {item['qty']}
              </div>
              <div on:click={(e)=> console.log('gggg')}><Icon.TrashSolid class='mr-2' size="20" /></div>
      

              
            </div>
          </Listgroup>
         
            {:else}
              <h11>데이터가 존재하지 않습니다. </h11>
          
          
          {/if}



             <Footer />
        </Card>

      
                    

                   
           
             
            
       
        
        
    
    