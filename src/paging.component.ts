import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'paging',
    template: `
    <div class="row">
        <div class="col-md-5 pagination">Showing {{lowerRowCount}} to {{upperRowCount}} of {{totalRowCount}} entries</div>
        <div class="col-md-7">
            <div class="dataTables_paginate paging_simple_numbers pull-right" id="example2_paginate">
                    <ul class="pagination">
                        <li class="paginate_button previous" [class.disabled]="isPreviousDisabled"><a (click)="onPreviousClick()">Previous</a></li>
                        <li class="paginate_button "><a>{{currentPage}} of {{totalPage}}</a></li>
                        <li class="paginate_button next" [class.disabled]="isNextDisabled"><a (click)="onNextClick()">Next</a></li>
                    </ul>
                </div>
            </div>
    </div>
    `
})
export class PagingComponent implements OnInit, OnChanges {
    @Input() pagingModel  : PagingModel;
    @Output() pageChangeRequested: EventEmitter<PagingChangeModel> = new EventEmitter<PagingChangeModel>();  
    
    lowerRowCount : number;
    upperRowCount : number;
    totalRowCount : number;

    currentPage : number;
    totalPage : number;

    isPreviousDisabled : boolean = false;
    isNextDisabled : boolean = false;

    constructor() { }

    ngOnInit() { }

    ngOnChanges() {    

        console.log("changed");        

        if(this.pagingModel.pageSize >= this.pagingModel.resultCount ){
            this.lowerRowCount = 1
            this.upperRowCount = this.pagingModel.resultCount;
        }
        else{
            let upperCount = this.pagingModel.pageNumber * this.pagingModel.pageSize;
            this.lowerRowCount = (upperCount - this.pagingModel.pageSize) + 1 ;

            upperCount >  this.pagingModel.resultCount 
            ? this.upperRowCount = this.pagingModel.resultCount 
            : this.upperRowCount = upperCount;
            
        }
        

        this.totalRowCount = this.pagingModel.resultCount;

        this.currentPage = this.pagingModel.pageNumber;

        if(this.pagingModel.pageSize >= this.pagingModel.resultCount){
            this.totalPage = 1;
        }
        else {
             this.totalPage = this.pagingModel.totalPages;
        }

        this.currentPage <= 1 ? this.isPreviousDisabled = true : this.isPreviousDisabled = false;

        this.currentPage >= this.totalPage ? this.isNextDisabled = true : this.isNextDisabled = false;
    }

    onPreviousClick(){
            if(this.isPreviousDisabled === true)
            {
                return;
            }

            let page = this.currentPage - 1;

            if(page <= 1)
            {
                page = 1;
            }

            let event = new PagingChangeModel(page);
            this.pageChangeRequested.emit(event);
    }   

    onNextClick(){
            if(this.isNextDisabled === true)
            {
                return;
            }
            let page = this.currentPage + 1;

            if(page >= this.totalPage)
            {
                page = this.totalPage;
            }

            let event = new PagingChangeModel(page);
            this.pageChangeRequested.emit(event);
    } 
}


export class PagingModel {
        resultCount : number;
        pageNumber : number;
        totalPages : number;
        pageSize : number;

        constructor(resultCount : number,
                    pageNumber : number,
                    totalPages : number,
                    pageSize : number) {
                this.resultCount = resultCount;
                this.pageNumber = pageNumber;
                this.totalPages = totalPages;
                this.pageSize = pageSize;           
        }
}


export class PagingChangeModel {
    pageNumberRequired : number;

    constructor(pageNumberRequired : number){
        this.pageNumberRequired = pageNumberRequired;
    }
}