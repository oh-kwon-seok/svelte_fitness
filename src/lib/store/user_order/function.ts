

//@ts-nocheck
import { DateTime } from 'luxon';
import { writable } from 'svelte/store';
import {user_order_modal_state,user_order_form_state} from './state';


import {v4 as uuid} from 'uuid';
import axios from 'axios'
import {common_alert_state, common_toast_state,common_search_state,login_state,table_state,table_real_state,common_selected_state,common_user_state} from '$lib/store/common/state';
import {selectCardQuery} from '$lib/store/common/function';

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
let table_real_data : any;

let user_data : any;

let selected_data : any;


let init_form_data = {
  uid : 0,
  user : '',

  price_status : '미수금',
  order_status : '주문완료',
  req_date : moment().add(1, 'day').format('YYYY-MM-DD'),
  req_des : '',
  description : '**농협 김옥병(453103-56-019411) 오늘도 건강하고 힘나는 하루 되세요**',
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
table_real_state.subscribe((data) => {
  table_real_data = data;
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
    
    }
    if(title === 'check_delete'){
      Object.keys(update_form).map((item)=> {    
        if(item === 'car'){
          update_form[item] = data[item]['uid'];
        }else if(item === 'user'){
          update_form[item] = data[item]['id'];
        }else{
          update_form[item] = data[item];
        }
       
    }); 
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
      table_data[type].setData(res.data);
      table_state.update(() => table_data);
    
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



  update_modal['title'] = 'add';
  update_modal['add']['use'] = true;
 
    if(title === 'add'){
    
      let data = table_data['user_order_sub2_list'].getData();
      
   
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
            req_date : param.req_date,
            req_des : param.req_des,
            description : param.description,
            user_id : user_uid,
            amount : 0,
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
      
      
      let data = table_data['user_order_sub2_list'].getData();
      
   
      let checked_data = data.filter(item => {
        return parseInt(item.qty) > 0 && item.qty !== undefined 
      });



      try {
        let params = {
          uid : param.uid,
          req_date : param.req_date,
          req_des : param.req_des,
          
          order_status : '주문완료',
          price_status : param.price_status,
          user_id : param.user,
          car_uid : param.car,
          amount : 0,
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
         
          
          toast['type'] = 'success';
          toast['value'] = true;
          update_modal['title'] = '';
          update_modal['update']['use'] = false;
          user_order_modal_state.update(() => update_modal);
          user_order_form_state.update(()=> init_form_data);
          selectCardQuery('user_order','mobile_temp_select');
          return common_toast_state.update(() => toast);

        }else{
        
          return common_toast_state.update(() => TOAST_SAMPLE['fail']);
        }
      })
      }catch (e:any){
        return console.log('에러 : ',e);
      };


     
    }if(title === 'check_delete'){
      let uid_array = [];
          uid_array.push(param.uid);
        
      
        if(uid_array.length > 0){

          const url = `${api}/user_order/delete`
          try {
    
            let params = {
              uid : uid_array,
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
              update_modal[title]['use'] = false;
              user_order_modal_state.update(() => update_modal);
              user_order_form_state.update(()=> init_form_data);

              selectCardQuery('user_order','mobile_temp_select');
    
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
    
      let data = table_data['user_order_sub2_list'].getData();
      
   
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
            
            order_status : '장바구니',
            price_status : '미수금',
            amount : 0,
            req_date : param.req_date,
            req_des : param.req_des,
            description : param.description,
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
          req_date : param.req_date,
          req_des : param.req_des,
          amount : 0,
          order_status : '장바구니',
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
         
          
          toast['type'] = 'success';
          toast['value'] = true;
          update_modal['title'] = '';
          update_modal['update']['use'] = false;
          user_order_modal_state.update(() => update_modal);
          user_order_form_state.update(()=> init_form_data);
          selectCardQuery('user_order','mobile_temp_select');
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


  const userOrderSubTable = (table_state,type,tableComponent) => {

   
    
    let user_id = getCookie('my-cookie');

    

      
          let url;
          let params;
          update_modal['title']
          
          url = `${api}/user_product/info_select`;
          params = { user_id : user_id};

          const config = {
            params : params,
            headers:{
              "Content-Type": "application/json",
              
            }
          }
            axios.get(url,config).then(res=>{
              
              let user_order_checked_data =  res.data;


              if(table_state['user_order_sub']){
                table_state['user_order_sub'].destory();
              }
              
            
              for(let i=0; i < user_order_checked_data.length; i++){
                user_order_checked_data[i]['uid'] = user_order_checked_data[i]['product']['uid'];
                user_order_checked_data[i]['name'] = user_order_checked_data[i]['product']['name'];
                user_order_checked_data[i]['qty'] = 0;
                user_order_checked_data[i]['price'] = 0;
                user_order_checked_data[i]['buy_price'] = 0;
                user_order_checked_data[i]['supply_price'] = 0;
                
              }
              table_real_data['user_order_sub_list'] = user_order_checked_data; // 원본데이터 보관용
              table_real_state.update(()=> table_real_data);

             
              table_data['user_order_sub_list'] =   new Tabulator(tableComponent, {
                tooltips: true, // 전역 설정: 모든 열에 툴팁 적용
              

                height:"50vh",
                //layout:"fitDataTable",
                layout:"fitColumns",

                movableColumns:TABLE_TOTAL_CONFIG['movableColumns'],
                locale: TABLE_TOTAL_CONFIG['locale'],
                langs: TABLE_TOTAL_CONFIG['langs'],
               
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
             
           });


               if(update_modal['title'] === 'update'){
                  let url = `${api}/user_order_sub/info_select`;
                  let params = { user_order_uid : update_form.uid};
                  const config = {
                    params : params,
                    headers:{
                      "Content-Type": "application/json",
                      
                    }
                  }

                  axios.get(url,config).then(res=>{
                    
                    if(res.data.length > 0){


                      let user_order_temp_data =  res.data;


                      if(table_state['user_order_sub2_list']){
                        table_state['user_order_sub2_list'].destory();
                      }
                      
                    
                      for(let i=0; i < user_order_temp_data.length; i++){
                        user_order_temp_data[i]['uid'] = user_order_temp_data[i]['product']['uid'];
                        user_order_temp_data[i]['name'] = user_order_temp_data[i]['product']['name'];
                        user_order_temp_data[i]['qty'] =  parseInt(user_order_temp_data[i]['qty']);
                        user_order_temp_data[i]['price'] = 0;
                        user_order_temp_data[i]['buy_price'] = 0;
                        user_order_temp_data[i]['supply_price'] = 0;
                        
                      }



                     console.log(table_real_data['user_order_sub2_list']);
                     if(table_real_data['user_order_sub2_list'].length === 0){
                      table_real_data['user_order_sub2_list'] = user_order_temp_data;

                      table_data['user_order_sub2_list'].setData(user_order_temp_data);
                      table_real_state.update(()=> table_real_data); 
                      table_state.update(()=> table_data);
                     }else{

                     }
                    
                    }


                    });
                }
       
    }
      
    
 



const userOrderSub2Table = (table_state,tableComponent) => {
      
  console.log('table_real_data:',table_real_data['user_order_sub2_list']);
  console.log('table_real_data:',update_modal['title']);
  
  // console.log('table_get_data:',table_data['user_order_sub2_list'].getData());
  
  if(update_modal['title'] === 'add'){
    table_data['user_order_sub2_list'] =   new Tabulator(tableComponent, {
      tooltips: true, // 전역 설정: 모든 열에 툴팁 적용
      height:"50vh",
      //layout:"fitDataTable",
      layout:"fitColumns",


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
      data : table_real_data['user_order_sub2_list'],
      columns: TABLE_HEADER_CONFIG['user_order_sub2_list'],
      
      });

      table_state.update(()=> table_data);
      table_real_state.update(()=> table_real_data);

  }else if(update_modal['title'] === 'update'){

    console.log('real2 : ', table_real_data['user_order_sub2_list']);
      table_data['user_order_sub2_list'] =   new Tabulator(tableComponent, {
        tooltips: true, // 전역 설정: 모든 열에 툴팁 적용
        height:"20vh",
        layout:"fitDataTable",
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
        data : table_real_data['user_order_sub2_list'],
        columns: TABLE_HEADER_CONFIG['user_order_sub2_list'],
        
        });
  
        table_state.update(()=> table_data);
        table_real_state.update(()=> table_real_data);
    

  }
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
  
  console.log('title : ', title);


  update_modal['title'] = '';
  update_modal[title]['use'] = !update_modal[title]['use'];

  alert['type'] = 'save';
  alert['value'] = false;
  common_alert_state.update(() => alert);
  if(table_state['user_order_sub_list']){
  
    table_state['user_order_sub_list'].destory();
    table_state['user_order_sub2_list'].destory();

    table_real_data['user_order_sub2_list'] = [];
    table_state.update(()=> table_data);
    table_real_state.update(()=>  table_real_data);

  }

  user_order_modal_state.update(() => update_modal);





}

const userOrderTabClick = (title) => {
  
  console.log(title);
  if(table_real_data['user_order_sub_list'].length > 0){
   
    console.log('user_order_sub_list : ',table_real_data['user_order_sub_list']);

    let check_data = [];
    if(title === "전체"){
      check_data = table_real_data['user_order_sub_list'];
    }else {
      check_data = table_real_data['user_order_sub_list'].filter(item=> {
        return item['product']['type']['name'] === title;
      })
    }
    
    table_data['user_order_sub_list'].setData(check_data);
    table_state.update(()=> table_data);
    

  }
}

// tabulator에서만 사용가능한 함수임
function updateUserOrder(cell:any) {

  console.log('ce;; : ', cell);
  // "qty" 셀과 "price" 셀의 값을 가져옴
  var qty = cell.getData().qty || 0;
  var price = cell.getData().price || 0;

  // "supply_price" 셀을 계산하여 업데이트
  var supplyPrice = qty * price;



  cell.getRow().update({ supply_price: supplyPrice });

  
  if(qty > 0){
    let new_data = cell.getData();
  
  
    let checkData = table_real_data['user_order_sub2_list'].find(item => item['product']['uid'] === new_data['product']['uid']);
  
    
    if(checkData){

      console.log('checkData : ', checkData);
      
      for(let i=0; i<table_real_data['user_order_sub2_list'].length; i++){
        
        if(table_real_data['user_order_sub2_list'][i]['product']['uid'] === checkData['product']['uid']){
          table_real_data['user_order_sub2_list'][i]['qty'] = qty;

        }
      }
    
      
  
    }else{
      table_real_data['user_order_sub2_list'].push(new_data);
      table_real_state.update(()=> table_real_data);
  
    }
  
   
    console.log('real_Data ; ', table_real_data['user_order_sub2_list']);

    table_data['user_order_sub2_list'].setData(table_real_data['user_order_sub2_list']);
  
    table_state.update(()=> table_data);

  }
}

function deleteUserOrder(cell:any) {

  let new_data = cell.getData();
  
  
  let checkData = table_real_data['user_order_sub_list'].find(item => item['product']['uid'] === new_data['product']['uid']);


  if(checkData){
    checkData['qty'] = 0;
    

  
  let newData = table_data['user_order_sub2_list'].getData().filter(item => item['product']['uid'] !== checkData['product']['uid']);

  table_data['user_order_sub2_list'].setData(newData);



  table_real_data['user_order_sub2_list'] = newData; 

  table_state.update(()=> table_data);

  table_real_state.update(()=> table_real_data);

  

    
  }else{
    

  }

 

 
 
   
}




export {userOrderModalOpen,save,userTable,userOrderSubTable,userOrderFileUpload,tempSave,modalClose,userOrderTabClick,updateUserOrder,userOrderSub2Table,deleteUserOrder}