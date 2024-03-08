
<script>

    // @ts-nocheck
    import { Hr, Button ,Modal, Label, Select, Input, Helper,Textarea} from 'flowbite-svelte'
    
    import * as Icon from 'svelte-awesome-icons';
    
     import Toast from '$lib/components/toast/Toast.svelte';
    import Alert from '$lib/components/alert/Alert.svelte';
    import AlertModal from '$lib/components/alert/Modal.svelte';
    

    import {user_order_modal_state, user_order_form_state} from '$lib/store/user_order/state';
    import {common_alert_state, common_toast_state,common_car_state,table_state,table_real_state, login_state, common_type_state} from '$lib/store/common/state';
    import { setCookie, getCookie, removeCookie } from '$lib/cookies';

    import {save,userOrderSubTable,userTable,userOrderFileUpload,tempSave,modalClose,userOrderTabClick,userOrderSub2Table} from '$lib/store/user_order/function';
    
    
    import {fileButtonClick} from '$lib/store/common/function';


    import {DATA_FAIL_ALERT,DATA_SELECT_ALERT,PROD_TYPE_ARRAY} from '$lib/module/common/constants';
    
    import {onMount,afterUpdate } from 'svelte';
    import { writable } from 'svelte/store';
    import { FireOutline,ImageOutline ,ExclamationCircleOutline} from 'flowbite-svelte-icons';
    export let title;


    



    let label_title = '';
   
   
    if(title === 'add'){
      label_title = '주문 저장';
    }else if(title === 'update'){
      label_title = '장바구니 수정';
    }else if(title === 'delete'){
      label_title = '장바구니 삭제';
    }else if(title === 'check_delete'){
      label_title = '장바구니 삭제';
    }

    let color = title === 'add' || title === 'update' ? 'blue' : 'red'; 
 
    let tableComponent = "example-table-theme";
    let tableComponent1 = "example-table-theme";
    

    onMount(()=>{

      

       
      if(getCookie('my-cookie') !== ''){
         
         userOrderSubTable(table_state,"user_order_sub",tableComponent);
        userOrderSub2Table(table_state,tableComponent1);

         
       }

      });

      afterUpdate(()=> {
      
        if(getCookie('my-cookie') !== ''){
         
          userOrderSubTable(table_state,"user_order_sub",tableComponent);
          userOrderSub2Table(table_state,tableComponent1);
         
        }
      })



  


  

    </script>



    

    <Modal title={`${label_title}`} permanent={true} color={color} bind:open={$user_order_modal_state[title]['use']} size="xl" placement={title === 'add' || title === 'check_delete'  ? 'center' : 'center-right'}   class="w-full">
       
          <!-- grid grid-cols-2 gap-4 -->
        <form action="#">
          {#if title === 'add' || title === 'update'}


          <ul class="flex list-none overflow-x-auto whitespace-nowrap pt-2.5 border-b-2 border-solid border-indigo-500 ">

            <li class="mr-2.5 ">
              <a href="#" class="no-underline font-bold text-blue-800 rounded-s-md transition duration-300 ease  hover:bg-sky-300 transition duration-300 ease" on:click={()=>userOrderTabClick("전체")}>{"전체"}</a>
            </li>

            {#each $common_type_state as item} 
              <li class="mr-2.5 ">
                <a href="#" class="no-underline font-bold text-blue-800 rounded-s-md transition duration-300 ease  hover:bg-sky-300 transition duration-300 ease" on:click={()=>userOrderTabClick(item.name)}>{item.name}</a>
              </li>
            {/each}

          </ul>

          
         
       

         

          
            <p class="mt-5 mb-1 font-semibold text-xl dark:text-white">배송 희망일</p>
            <Input type="date"   id="last_name" placeholder="배송희망일자를 입력하세요" required bind:value={$user_order_form_state['req_date']}/>
            
            {#if $user_order_form_state['req_date'] === ''}
            <Helper class="mt-2" color="red"><span class="font-medium">배송희망일자를 입력하세요</span></Helper>
            {/if}
        

          
          <Hr class="my-2 bg-slate-300 "  height="h-1"></Hr>


          <p class="mb-1 font-semibold text-xl dark:text-white">상품 목록</p>

          
          <div class="mt-5" id="example-table-theme" bind:this={tableComponent}></div>
          <Hr class="my-8 bg-slate-300 "  height="h-1"></Hr>

          <p class="mb-2 font-semibold text-xl dark:text-white">주문 목록</p>
        
          <div class="mt-5" id="example-table-them1" bind:this={tableComponent1}></div>


          <p class="mt-5 mb-1 font-semibold text-xl ">요청 사항</p>
          <Textarea id="textarea-id" placeholder="요청사항이 있다면 입력해주세요" rows="4" name="message" bind:value={$user_order_form_state['req_des']}/>

          <div class='mt-5 text-center flex flex-row '>
          
          
          
          <Button  class="w-1/2 mr-3" color='blue' on:click={(e)=> fileButtonClick('upload')}>
            <Icon.FileImageSolid class='mr-2' size="20" />
              사진 주문
            <input 
            hidden  
            id = 'upload' 
            type='file' 
            accept="image/*"
            on:change={(e)=> userOrderFileUpload(e)}
            />
        </Button>
        
       
       
       
      
        
        <Button  class="w-1/2" color='green' on:click={tempSave($user_order_form_state,title)}>
          <Icon.BasketShoppingSolid class='mr-2' size="20" />
          장바구니
        </Button>
      
        

        
        {#if $user_order_form_state['selectedImage']}
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img style="max-width: 100%;max-height: 300px;margin-top: 10px;" src={$user_order_form_state['selectedImage']} alt="Selected Image" />

      

        {/if}
    </div>

    




       
       
        
      {/if}
    
    
      {#if title === 'check_delete'}
              <div>선택한 항목을 삭제하시겠습니까?</div>
      {/if}
        </form>
        
        
      
        

        {#if $common_alert_state['type'] === 'save' && $common_alert_state['value'] === true}
            
        
        
        <AlertModal content={DATA_FAIL_ALERT['add'].content}/>

        
        
       
         {/if}

        
   

        <svelte:fragment slot='footer'>
   
        
      
      
         
         
   
        <Button  color={'blue'}   class="w-full" on:click={save($user_order_form_state,title)}>{title === 'update' ? '주문' : label_title}</Button>

         
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

    