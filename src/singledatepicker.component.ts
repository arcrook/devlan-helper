import {Component, ElementRef, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { FormControl } from '@angular/forms';

//Talk to jquery
declare var $: any;

@Component({
    selector: 'SingleDatePickerComponent',
    template: `  
     <div class="input-group">
    <input name="datepicker" class="form-control pull-right"
                        (valueChanged)="onValueChanged($event)"
                        value="{{formatDate()}}"
                        [disabled]="isDisabled()" 
                        readonly="readonly" [style.background]="background"
                        style="cursor: pointer;"/>
     <div class="input-group-addon"><i class="fa fa-calendar" aria-hidden="true"></i></div>
                        </div>
    `
})
export class SingleDatePickerComponent implements OnInit {
    options = {
        singleDatePicker: true,
        showDropdowns: true,
        locale: {
                format: 'DD-MMM-YYYY',
                startDate: null,
                endDate: null
                }
    };
   
    @Input() startDate  : Date;
    @Input() disabled : boolean;
    @Output() valueChanged: EventEmitter<any> = new EventEmitter();
    @Output() selected: EventEmitter<SingleDate> = new EventEmitter<SingleDate>();  

    background : string = "white";

    constructor(private elementRef: ElementRef) { }

    isDisabled() : boolean {
        if(this.disabled) {
            this.background = "";
        }
        else{
             this.background = "white";
        }

        return this.disabled;
    }

    ngOnInit() {

        this.options.locale.startDate = this.startDate;
        this.options.locale.endDate = this.startDate;
        //via jquery select the input and intitialise the datepicker
        $(this.elementRef.nativeElement).children().children('input[name="datepicker"]')
            .daterangepicker(this.options, null).on('apply.daterangepicker', this.dateCallbackApply.bind(this));
    }

    formatDate() : string
    {
        let date1 : Date
        if (typeof this.startDate === 'undefined')
        {
            date1 = new Date();
        }
        else{
            date1 = new Date(this.startDate.toString());
        }
        
        let months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        let month = months[date1.getMonth()];

        return date1.getDate() + '-' + month + '-' + date1.getFullYear();
    }


    onInputChange(event : any) {      
       $('#daterange').data('daterangepicker').setStartDate(this.formatDate);
    }

    dateCallbackApply(ev: any, picker: any){
        // by design the picker will set the time of the date to 00:00 UTC time, hovever dateTime used in logic 
        // and in JSON serialisation is the LOCAL time, there for need to adjust time so that LOCAL time is 00:00  

        let date : Date = new Date(picker.startDate._d.toUTCString());
        var minDiffToUtc = date.getTimezoneOffset();
 
        date = new Date(date.getTime() -(minDiffToUtc*60000));

        let message = new SingleDate(date);
        this.selected.emit(message);
    }
}


export class SingleDate {
    startDate: Date;

    constructor(startDate: Date) {
        this.startDate = startDate;
    }
}