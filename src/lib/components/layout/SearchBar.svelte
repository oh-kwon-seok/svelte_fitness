<script>
  // @ts-nocheck
    import {Breadcrumb,BreadcrumbItem} from 'flowbite-svelte';


    import { Button,Input,Label,Select,Search} from 'flowbite-svelte';
    import { SearchOutline } from 'flowbite-svelte-icons';
    import {common_search_state} from '$lib/store/common/state';
	  import { selectCardQuery } from '$lib/store/common/function';
    export let title;
    export let label;
    
    let select;
    if(label === '구매일자'){
    
    
      select = 'mobile_buy_select';

    }if(title === 'user_order'){
      select = 'mobile_temp_select'
    
    }else {
      select = 'mobile_select'
    }
    
    
</script>





<main>
  <slot />
</main>

<form class="flex gap-1">
  <div class="w-full">
    
    <Label for="first_name" class="mb-2">{label}</Label>
    <Input   class="border-2 rounded-md p-2" type="month" id="start_date" required bind:value={$common_search_state['start_date']} on:change={()=> selectCardQuery(title,select)}/>
  </div>

   
</form>