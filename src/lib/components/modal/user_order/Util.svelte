
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper,Card} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
    import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import {user_order_modal_state, user_order_form_state} from '$lib/store/user_order/state';
    import {common_alert_state, common_toast_state,common_car_state,table_state, login_state} from '$lib/store/common/state';
    import { setCookie, getCookie, removeCookie } from '$lib/cookies';

    import {save,userOrderSubTable,userTable,userOrderFileUpload,tempSave} from '$lib/store/user_order/function';
    
    
    import {fileButtonClick} from '$lib/store/common/function';


    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT} from '$lib/module/common/constants';
    
    import {onMount,afterUpdate } from 'svelte';
    export let title;


    console.log('title',title);
    
    let label_title = '';
   
   
    if(title === 'add'){
      label_title = '저장';
    }else if(title === 'update'){
      label_title = '수정';
    }else if(title === 'delete'){
      label_title = '삭제';
    }else if(title === 'check_delete'){
      label_title = '선택 삭제';
    }

    let color = title === 'add' || title === 'update' ? 'blue' : 'red'; 
 
    let tableComponent1 = "example-table-theme1";

    onMount(()=>{

      

       
      if(getCookie('my-cookie') !== ''){
         
         userOrderSubTable(table_state,"user_order_sub",tableComponent1);
       }

      });

      afterUpdate(()=> {
      
        if(getCookie('my-cookie') !== ''){
         
          userOrderSubTable(table_state,"user_order_sub",tableComponent1);
        }
      })

  

    </script>



    

    <Modal title={`주문 ${label_title}`} color={color} bind:open={$user_order_modal_state[title]['use']} size="xl" placement={title === 'add' || title === 'check_delete'  ? 'center' : 'center-right'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#">
          {#if title === 'add' || title === 'update'}
          
          <div id="example-table-theme1" bind:this={tableComponent1}></div>

          <div class='mt-5 text-center'>
          <Button  class="w-full" color='blue' on:click={(e)=> fileButtonClick('upload')}>
            <Icon.FileImageSolid class='mr-2' size="20" />
              사진으로 주문
            <input 
            hidden  
            id = 'upload' 
            type='file' 
            accept="image/*"
            on:change={(e)=> userOrderFileUpload(e)}
            />
        </Button>
      


        
        {#if $user_order_form_state['selectedImage']}
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img style="max-width: 100%;max-height: 300px;margin-top: 10px;" src={$user_order_form_state['selectedImage']} alt="Selected Image" />

      

        {/if}
    </div>



         {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
            
         <Alert  state={'add'} color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT['add'].title} content={DATA_FAIL_ALERT['add'].content} />

       {/if}
       
        
          {#if $common_alert_state['type'] === 'select' && $common_alert_state['value'] === true}
            
            <Alert  state={'select'} color={DATA_SELECT_ALERT.color} title={DATA_SELECT_ALERT['select'].title} content={DATA_SELECT_ALERT['select'].content} />

          {/if}
          

          <div class="grid grid-cols-6 gap-4">
           
          </div>
            {:else }
              {#if title === 'delete'}
              <div>삭제하시겠습니까?</div>
              {:else }
              <div>선택한 항목을 삭제하시겠습니까?</div>
              
              {/if}
          {/if}
    
    
      
      
        </form>
        <!-- <svelte:fragment slot='footer'>
          <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}   class="w-full" on:click={save($user_order_form_state,title)}>{label_title}</Button>
       
          
        
        </svelte:fragment> -->
        <Button  color={title === 'add' || title === 'update'  ? 'blue' : 'red'}   class="w-full" on:click={save($user_order_form_state,title)}>{label_title}</Button>
        

        {#if title === 'add'}

          <Button  class="w-full" color='green' on:click={tempSave($user_order_form_state,title)}>
            <Icon.BasketShoppingSolid class='mr-2' size="20" />
            장바구니
          </Button>
        {/if}

       


       
        {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
     
        
        <!-- <div class="mt-12">
               <Alert  color={DATA_FAIL_ALERT.color} title={DATA_FAIL_ALERT[title].title} content={DATA_FAIL_ALERT[title].content}/>
           </div> -->
        {/if}

      </Modal>

    