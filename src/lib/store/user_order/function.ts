

//@ts-nocheck
import { DateTime } from 'luxon';
import { writable } from 'svelte/store';
import {user_order_modal_state,user_order_form_state} from './state';


import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_state,common_selected_state,common_user_state} from '$lib/store/common/state';
import moment from 'moment';

import {TOAST_SAMPLE} from '$lib/module/common/constants';
import { businessNumber,phoneNumber} from '$lib/module/common/function';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import {TABLE_TOTAL_CONFIG,TABLE_HEADER_CONFIG,TABLE_FILTER} from '$lib/module/common/constants';
import { setCookie, getCookie, removeCookie } from '$lib/cookies';

const api = import.meta.env.VITE_API_BASE_URL;




let update_modal : any;
let update_form : any;
let list_data : any;
let alert : any;
let toast : any;
let search_state : any;
let login_data : any;
let table_data : any;
let user_data : any;

let selected_data : any;


let init_form_data = {
  uid : 0,
  user : '',

  price_status : '미수금',
  order_status : '주문완료',
  car : '',
  used : 1,
  selectedImage : '',

}


user_order_modal_state.subscribe((data) => {
    update_modal = data;
})

user_order_form_state.subscribe((data) => {
    update_form = data;
})


common_alert_state.subscribe((data) => {
  alert = data;
})
common_toast_state.subscribe((data) => {
  toast = data;
})

common_search_state.subscribe((data) => {
  search_state = data;
})

login_state.subscribe((data) => {
  login_data = data;
})
table_state.subscribe((data) => {
  table_data = data;
})

common_selected_state.subscribe((data) => {
  selected_data = data;
})

common_user_state.subscribe((data) => {
  user_data = data;
})
 
 






const userOrderModalOpen = (data : any, title : any) => {
 
    alert['type'] = 'save';
    alert['value'] = false;
    
    common_alert_state.update(() => alert);
    update_modal['title'] = title;
    update_modal[title]['use'] = true;
    user_order_modal_state.update(() => update_modal);

    console.log('update_modal : ', update_modal);
   

    if(title === 'add'){
      user_order_form_state.update(() => init_form_data);
     
    }
    if(title === 'update' ){

        Object.keys(update_form).map((item)=> {    
            if(item === 'car'){
              update_form[item] = data[item]['uid'];
            }else if(item === 'user'){
              update_form[item] = data[item]['id'];
            }else{
              update_form[item] = data[item];
            }
           
        }); 

            user_order_form_state.update(() => update_form);
            user_order_modal_state.update(() => update_modal);
            console.log('update_modal : ', update_modal);

    }
    if(title === 'check_delete'){
      let data =  table_data['user'].getSelectedData();

      common_selected_state.update(() => data);
      
      console.log('modalOpen : ', data);
      let uid_array = [];
      if(data.length === 0){
        alert['value'] = true;
        common_alert_state.update(() => alert);

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['uid']);
        }
      }
  }
}






const select_query = (type) => {
   
  const url = `${api}/${type}/select`; 
        
  let basic_date = moment().subtract(90,'days');
  

  
  let start_date = basic_date.format('YYYY-MM-DDTHH:mm:ss');
  let end_date = basic_date.add(150,'days').format('YYYY-MM-DDTHH:mm:ss');


  let params = 
  {
    start_date : start_date,
    end_date  : end_date
  };
  const config = {
    params : params,
    headers:{
      "Content-Type": "application/json",
      
    }
  }
    axios.get(url,config).then(res=>{
      console.log('table_state : ', table_state['user_order']);
      table_data[type].setData(res.data);
      table_state.update(() => table_data);
      console.log('table_data : ', table_data);
   })

}

const save = (param,title) => {
  

  let user_uid = getCookie('my-cookie');
  let car_uid;
  let car_data = user_data.filter(item => {
    return user_uid === item.id; 
  })

 
  if(car_data){
    car_uid = car_data[0]['car']['uid'];
  }else{
    return console.log('차량이 정해지지 않았습니다.관리자에게 문의하십시오.');
  }


  console.log('param : ', param);

  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
      console.log('param : ', param);
      let data = table_data['user_order_sub_list'].getData();
      
      
      let checked_data = data.filter(item => {
        return parseInt(item.qty) > 0 && item.qty !== undefined 
      })

     
    
      if( car_uid === '' || (checked_data.length === 0 &&  param['selectedImage']==='')){
        //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        alert['type'] = 'save';
        alert['value'] = true;
        user_order_modal_state.update(() => update_modal);
 
        return common_alert_state.update(() => alert);
  
      }else {
      
        const url = `${api}/user_order/save`
        try {
  
          
          let params = {
            
            order_status : '주문완료',
            price_status : '미수금',
            user_id : user_uid,
            car_uid : car_uid,
            used : param.used,
            image_url : param['selectedImage'],  
            auth : 'user',
            user_order_sub : checked_data,
            token : login_data['token'],
          };
        axios.post(url,
          params,
        ).then(res => {
          console.log('res',res);
          if(res.data !== undefined && res.data !== null && res.data !== '' ){
          
            toast['type'] = 'success';
            toast['value'] = true;
            update_modal['title'] = '';
            update_modal['add']['use'] = !update_modal['add']['use'];
            user_order_modal_state.update(() => update_modal);
    
    
            return common_toast_state.update(() => toast);

          }else{
          
            return common_toast_state.update(() => TOAST_SAMPLE['fail']);
          }
        })
        }catch (e:any){
          return console.log('에러 : ',e);
        };
      }


    
    }
    
    if(title === 'update'){
      const url = `${api}/user_order/update`
      
      
      let data =  table_data['user_order_sub'].getSelectedData();

      let checked_data = data.filter(item => {
        return parseInt(item.qty) > 0 && item.qty !== undefined 
      })

     
     
      try {

        
        let params = {

          uid : param.uid,
          order_status : param.order_status,
          price_status : param.price_status,
          user_id : param.user,
          car_uid : param.car,
          used : param.used,
          auth : 'user',
          user_order_sub : checked_data,
          token : login_data['token'],

         
        

        };
      axios.post(url,
        params,
      ).then(res => {
        console.log('res',res);
        if(res.data !== undefined && res.data !== null && res.data !== '' ){
          console.log('실행');
          console.log('res:data', res.data);
          
          toast['type'] = 'success';
          toast['value'] = true;
          update_modal['title'] = '';
          update_modal['update']['use'] = false;
          user_order_modal_state.update(() => update_modal);
          user_order_form_state.update(()=> init_form_data);
          select_query('user_order');
          return common_toast_state.update(() => toast);

        }else{
        
          return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        }
      })
      }catch (e:any){
        return console.log('에러 : ',e);
      };


     
    }if(title === 'check_delete'){
      let data =  selected_data;
      let uid_array = [];

      console.log('deleted_data : ', data);
      if(data.length === 0){
        alert['value'] = true;
        common_alert_state.update(() => alert);

      }else{
        for(let i=0; i<data.length; i++){
          uid_array.push(data[i]['id']);
        }
      }

        if(uid_array.length > 0){

          const url = `${api}/user/delete`
          try {
    
            let params = {
              id : uid_array,
            };
          axios.post(url,
            params,
          ).then(res => {
            console.log('res',res);
            if(res.data !== undefined && res.data !== null && res.data !== '' ){
              console.log('실행');
              console.log('res:data', res.data);
              
              toast['type'] = 'success';
              toast['value'] = true;
              update_modal['title'] = '';
              update_modal['update']['use'] = false;
              user_order_modal_state.update(() => update_modal);
              user_order_form_state.update(()=> init_form_data);

              select_query('user_order');
    
              return common_toast_state.update(() => toast);
    
            }else{
            
              return common_toast_state.update(() => TOAST_SAMPLE['fail']);
            }
          })
          }catch (e:any){
            return console.log('에러 : ',e);
          };
    
        }

        update_modal[title]['use'] = !update_modal[title]['use'];
        user_order_modal_state.update(() => update_modal);
        user_order_form_state.update(()=> init_form_data);
    }
  }



  const tempSave = (param,title) => {
  

    let user_uid = getCookie('my-cookie');
    let car_uid;
    let car_data = user_data.filter(item => {
      return user_uid === item.id; 
    })
  
   
    if(car_data){
      car_uid = car_data[0]['car']['uid'];
    }else{
      return console.log('차량이 정해지지 않았습니다.관리자에게 문의하십시오.');
    }
  
  
    console.log('param : ', param);
  
    update_modal['title'] = 'add';
    update_modal['add']['use'] = true;
   
      if(title === 'add'){
        console.log('param : ', param);
        let data = table_data['user_order_sub_list'].getSelectedData();
  
        let checked_data = data.filter(item => {
          return parseInt(item.qty) > 0 && item.qty !== undefined 
        })
  
        
      
        if( car_uid === '' || (checked_data.length === 0 )){
          //return common_toast_state.update(() => TOAST_SAMPLE['fail']);
          alert['type'] = 'save';
          alert['value'] = true;
          user_order_modal_state.update(() => update_modal);
   
          return common_alert_state.update(() => alert);
    
        }else {
        
          const url = `${api}/user_temp_order/save`
          try {
    
            
            let params = {
              
              order_status : '장바구니',
              user_id : user_uid,
              car_uid : car_uid,
              used : param.used,
              auth : 'user',
              user_temp_order_sub : checked_data,
              token : login_data['token'],
            };
          axios.post(url,
            params,
          ).then(res => {
            console.log('res',res);
            if(res.data !== undefined && res.data !== null && res.data !== '' ){
            
              toast['type'] = 'success';
              toast['value'] = true;
              update_modal['title'] = '';
              update_modal['add']['use'] = !update_modal['add']['use'];
              user_order_modal_state.update(() => update_modal);
      
      
              return common_toast_state.update(() => toast);
  
            }else{
            
              return common_toast_state.update(() => TOAST_SAMPLE['fail']);
            }
          })
          }catch (e:any){
            return console.log('에러 : ',e);
          };
        }
  
  
      
      }
      
    }


  const userOrderSubTable = (table_state,type,tableComponent) => {

    console.log('update : ', update_modal['title']);
    console.log('update : ', update_modal['title']);
    
    let user_id = getCookie('my-cookie');

    const url = `${api}/product/select`; 

  
    let start_date = moment().subtract(10, "year").format('YYYY-MM-DDTHH:mm:ss');

    let end_date = moment().add(1, "day").format('YYYY-MM-DDTHH:mm:ss');

    let search_text = '';
    let filter_title = 'all';
    let checked_data = [];
  

    let params = 
    {
      start_date : start_date,
      end_date  : end_date,
      search_text : search_text,
      filter_title : filter_title,   
    };

   
    const config = {
      params : params,
      headers:{
        "Content-Type": "application/json",
        
      }
    }
      axios.get(url,config).then(res=>{
        if(table_state['user_order_sub']){
          table_state['user_order_sub'].destory();
        }

        if(res.data.length > 0){
        
          let url;
          let params;
          update_modal['title']
          if(update_modal['title'] === 'add'){
            url = `${api}/user_product/info_select`;
            params = { user_id : user_id};

          }
          if(update_modal['title'] === 'update'){
             url = `${api}/user_order_sub/info_select`;
             params = { user_order_uid : update_form.uid};
          }
       

          const config = {
            params : params,
            headers:{
              "Content-Type": "application/json",
              
            }
          }
            axios.get(url,config).then(res=>{
              
              let user_order_checked_data =  res.data;
              
            
              for(let i=0; i < user_order_checked_data.length; i++){
                user_order_checked_data[i]['uid'] = user_order_checked_data[i]['product']['uid'];
                user_order_checked_data[i]['name'] = user_order_checked_data[i]['product']['name'];
                user_order_checked_data[i]['qty'] = 0;
                user_order_checked_data[i]['price'] = 0;
                user_order_checked_data[i]['buy_price'] = 0;
                user_order_checked_data[i]['supply_price'] = 0;
                
                
                
              }
             
              table_data['user_order_sub_list'] =   new Tabulator(tableComponent, {
                tooltips: true, // 전역 설정: 모든 열에 툴팁 적용
                
              
            
                height:"50vh",
                layout:"fitColumns",
                movableColumns:TABLE_TOTAL_CONFIG['movableColumns'],
                locale: TABLE_TOTAL_CONFIG['locale'],
                langs: TABLE_TOTAL_CONFIG['langs'],
                selectable: true,
                rowClick:function(e, row){
                  //e - the click event object
                  //row - row component
               
                  row.toggleSelect(); //toggle row selected state on row click
              },
      
                rowFormatter:function(row){
                      row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
                      let selected = row.getData().selected;

                      if(selected){
                        row.getElement().classList.add("tabulator-selected");
                        row.toggleSelect();
                      }
                },
                cellEdited:function(cell){
                  // 행이 업데이트될 때 실행되는 코드
                  var updatedData = cell.getData();
                  console.log("Updated Data:", updatedData);
                  // 여기에서 데이터를 처리하면 됩니다.
              },
                data : user_order_checked_data,
                columns: TABLE_HEADER_CONFIG['user_order_sub_list'],
                
                });
                table_state.update(()=> table_data);
             
           })
        
         
       
        
    }else{
      
      if(table_state['user_order_sub']){
        table_state['user_order_sub'].destory();
      }

      table_data['user_order_sub'] =   new Tabulator(tableComponent, {
        height:"25vh",
        layout:TABLE_TOTAL_CONFIG['layout'],
        movableColumns:TABLE_TOTAL_CONFIG['movableColumns'],
        locale: TABLE_TOTAL_CONFIG['locale'],
        langs: TABLE_TOTAL_CONFIG['langs'],
        selectable: true,
        placeholder:"데이터 없음",
        rowClick:function(e, row){
          //e - the click event object
          //row - row component
       
          row.toggleSelect(); //toggle row selected state on row click
      },

        rowFormatter:function(row){
              row.getElement().classList.add("table-primary"); //mark rows with age greater than or equal to 18 as successful;
        },
     

        data : [],
      
        columns: TABLE_HEADER_CONFIG['user_product'],
      
  
        });
        console.log('table_data  :', table_data);

        table_state.update(()=> table_data);


    }
     })

    
}

const userOrderFileUpload = (e) => {
  const file = e.target.files[0];
    if (file) {
      // 이미지 파일이 선택된 경우 처리
      const reader = new FileReader();

      

      reader.onload = (e) => {
        update_form['selectedImage'] = e.target.result;
       

        user_order_form_state.update(()=> update_form);
      };
      
      
      
      reader.readAsDataURL(file);
    }
}


const userTable = (table_state,type,tableComponent) => {

            table_data[type] =   new Tabulator(tableComponent, {
              height:"25vh",
              layout:TABLE_TOTAL_CONFIG['layout'],
              pagination:TABLE_TOTAL_CONFIG['pagination'],
              paginationSize:1000,
              paginationSizeSelector:[10, 50, 100,1000,5000],
              movableColumns:TABLE_TOTAL_CONFIG['movableColumns'],
              paginationCounter: TABLE_TOTAL_CONFIG['paginationCounter'],
              paginationAddRow:TABLE_TOTAL_CONFIG['paginationAddRow'], //add rows relative to the table
              locale: TABLE_TOTAL_CONFIG['locale'],
              langs: TABLE_TOTAL_CONFIG['langs'],
              selectable: true,
             
    

           
              data : user_data, 
              columns: [
                {formatter:"rowSelection",width : 60, field: "selected", titleFormatter:"rowSelection", hozAlign:"center", headerSort:false, 
                cellClick:function(e : any, cell:any){
                    console.log('cellClick',cellClick);
                    cell.getRow().toggleSelect();
                    
                }},
                {title:"ID", field:"id", width:150, headerFilter:"input"},
                {title:"사업자번호", field:"code", width:150, headerFilter:"input",
                formatter:function(cell : any){
                    var value = cell.getValue();
                return businessNumber(value);
                 },
                },
                {title:"상호명", field:"customer_name", width:150, headerFilter:"input", 
                formatter:function(cell : any){
                    var value = cell.getValue();
                    
                return "<span style='color:#3FB449; font-weight:bold;'>" + value + "</span>";
                 },
        
                cellClick:function(e : any, cell:any){
               
                    let row = cell.getRow();
                   if(row){
                    console.log('row : ', row.getData());
                    let id = row.getData().id;
                    let car = row.getData().car['uid'];
                    
                    update_form['user'] = id;
                    update_form['car'] = car;
                    
                    user_order_form_state.update(() => update_form);
                
                   }else{
                  
                   }
                }


                },
                {title:"지정차량", field:"car.name", width:150, headerFilter:"input"},
                {title:"연락처", field:"phone", width:150, headerFilter:"input", formatter:function(cell : any){
                    var value = cell.getValue();
                return phoneNumber(value);
                 },},
          
                {title:"이메일", field:"email", width:150, headerFilter:"input"},
                
                {title:"등록일", field:"created", hozAlign:"center", sorter:"date",  headerFilter:"input", 
                formatter: function(cell : any, formatterParams: any, onRendered: any) {
                    // Luxon을 사용하여 datetime 값을 date로 변환
                    const datetimeValue = cell.getValue();
                    const date = DateTime.fromISO(datetimeValue).toFormat("yyyy-MM-dd");
                    return date;
                }},     
            
           ],
           rowClick:function(e, row){
            //e - the click event object
            //row - row component
            console.log('test : ', row);
            row.toggleSelect(); //toggle row selected state on row click
        },

              });
              table_state.update(()=> table_data);
        
}


const modalClose = (title) => {
  
  


  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;
  common_alert_state.update(() => alert);
  if(table_data['user_order_sub']){
    table_data['user_order_sub'].destory();
    
    table_state.update(()=> table_data);

  }

  user_order_modal_state.update(() => update_modal);





}



export {userOrderModalOpen,save,userTable,userOrderSubTable,userOrderFileUpload,tempSave,modalClose}