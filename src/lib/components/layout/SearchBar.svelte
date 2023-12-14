<script>
  // @ts-nocheck
    import {Breadcrumb,BreadcrumbItem} from 'flowbite-svelte';


    import { Button,Input,Label,Select,Search} from 'flowbite-svelte';
    import { SearchOutline } from 'flowbite-svelte-icons';
    import {common_search_state} from '$lib/store/common/state';
	  import { selectCardQuery } from '$lib/store/common/function';
    export let title;
    
    
</script>





<main>
  <slot />
</main>

<form class="flex gap-1">
  <div class="w-full">
    
    <Label for="first_name" class="mb-2">주문일자</Label>
    <Input   class="border-2 rounded-md p-2" type="month" id="start_date" required bind:value={$common_search_state['start_date']} on:change={()=> selectCardQuery(title)}/>
  </div>

   
</form>