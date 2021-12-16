import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { interval, Observable } from 'rxjs';
import { GetDataService } from '../../services/get-data.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {

  quantity:number=0 ;
  companyDetails;
  companyId;
  // max_price:number;
  // min_price:number;
  amount:number;
  current_rate:number;
  qty:number;
  // data:number=Math.floor(Math.random() * 10);
  constructor(private router: Router,private toastr: ToastrService, private getDataservice: GetDataService, private _Activatedroute:ActivatedRoute) { }


  ngOnInit() {
    
    // const obs$=interval(2000);
    // obs$.subscribe((d)=>{
    //     this.data=this.getDataservice.getRandomNum(this.max_price,this.min_price);
    //     this.getAmount(this.data,this.quantity);
    //   });

    this._Activatedroute.paramMap.subscribe(params => { 
      this.companyId = params.get('id'); 
      });

      this.getDataservice.getMyShares(localStorage.getItem('username'))
      .subscribe(
        data => {
            for(let i=0;i<data.length;i++)
            {
              if(data[i].company_id==this.companyId)
              {
                this.companyDetails = data[i];
                this.current_rate=this.companyDetails.current_rate;
                // this.max_price=this.companyDetails.year_high;
                // this.min_price=this.companyDetails.year_low;
              }
            }
            
        },
        error => {
            console.log(error)
        }
      )
     
  }
 
  pendingSell(){
    this.getDataservice.pendingSell(  localStorage.getItem('username'), this.companyId, this.quantity )
    .subscribe(
      data => {this.brokrage();
        if(data.status === "Pending"){
          alert("Your sell request is pending");
          this.router.navigate(['userOrder'])
    }
  },
    error => {
        console.log(error)
    }
    )
  }
  
  
  sellItem()
  {
    this.getDataservice.sellShare(localStorage.getItem('username'), this.companyId, this.quantity)
      .subscribe(
        data => {
            if(data.status=="success")
		alert("The share sell successfully");
              this.router.navigate(['my-shares'])
        },
        error => {
            console.log(error)
        }
      )
  }
  checkQuantity(qty,availableQty)
  {
    if(isNaN(Number(qty.value)) || Number(qty.value) === 0 || Number(qty.value) > availableQty)
      return false;
    else
      return true;
  }
  getQuantity(quantity:number){
    this.qty=quantity;
    this.amount = this.current_rate * quantity;

  }

  brokrage(){
    if(this.qty<50){
      this.toastr.success('2% brokerage will apply');
      }else{
        this.toastr.success('3% brokerage will apply');
      }
    }
  cancel(){
    this.router.navigate(['my-shares'])
  }
}
