
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper,Textarea} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
     import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import AlertModal from '$lib/components/alert/Modal.svelte';
    

    import {user_product_modal_state, user_product_form_state} from '$lib/store/user_product/state';
    import {common_alert_state, common_toast_state,common_car_state,table_state,table_real_state, login_state} from '$lib/store/common/state';
    import { setCookie, getCookie, removeCookie } from '$lib/cookies';

    import {save,modalClose,userProductTable} from '$lib/store/user_product/function';
    
    
    import {fileButtonClick} from '$lib/store/common/function';


    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT,PROD_TYPE_ARRAY} from '$lib/module/common/constants';
    
    import {onMount,afterUpdate } from 'svelte';
    import { writable } from 'svelte/store';
    import { FireOutline,ImageOutline ,ExclamationCircleOutline} from 'flowbite-svelte-icons';
    export let title;


  
    let label_title = '';
   
   
    if(title === 'update'){
      label_title = '즐겨찾기 수정';
    }
    let color = title === 'add' || title === 'update' ? 'blue' : 'red'; 
 
    let tableComponent = "example-table-theme";

  
    onMount(()=>{

      

       
      if(getCookie('my-cookie') !== ''){
         
        userProductTable(table_state,"user_product",tableComponent);
      
         
       }

      });

      afterUpdate(()=> {
      
        if(getCookie('my-cookie') !== ''){
         
          userProductTable(table_state,"user_product",tableComponent);
      
        }
      })

    </script>



    

    <Modal title={`${label_title}`} permanent={true} color={color} bind:open={$user_product_modal_state[title]['use']} size="xl" placement={title === 'add' || title === 'check_delete'  ? 'center' : 'center-right'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#">
          {#if title === 'add' || title === 'update'}

      
          <p class="mb-1 font-semibold text-xl dark:text-white">즐겨찾기 목록</p>

          
          <div class="mt-5" id="example-table-theme" bind:this={tableComponent}></div>
          <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>

      {/if}
    
    
        </form>
        
        
      
        

        {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
            
        
        
        <AlertModal content={DATA_FAIL_ALERT['add'].content}/>

        
        
       
         {/if}

        
   

        <svelte:fragment slot='footer'>
   
        
      
      
         
         
   
        <Button  color={'blue'}   class="w-full" on:click={save($user_product_form_state,title)}>수정</Button>

         
          <Button  class="w-full" color='red' on:click={modalClose(title)}>
           
            닫기
          </Button>
      

       
         
       
        </svelte:fragment>
       
        {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
     
        
        <!-- <div class="mt-12">
               <Alert  color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT[title].title} content={DATA_FAIL_ALERT[title].content}/>
           </div> -->
        {/if}

      </Modal>

    