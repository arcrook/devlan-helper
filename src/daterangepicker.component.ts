import {Component, ElementRef, OnInit, Input, Output, EventEmitter} from '@angular/core';

//Talk to jquery
declare var $: any;

@Component({
    selector: 'DateRangePickerComponent',
    template: `  
         <div class="input-group input-group-sm" style="width: 250px;">
                    <input readonly="readonly" type="text" name="datepicker" class="form-control pull-right thing" placeholder="Search" 
                        (valueChanged)="onValueChanged($event)"
                        value="{{formatDate(startDate)}} - {{formatDate(endDate)}}"
                        [disabled]="disabled"/>
                   <div class="input-group-btn">
                            <button type="submit" class="btn btn-default" (click)="searchRange()"><i class="fa fa-search"></i></button>
                        </div>
        </div>
    `,
    styles: ['.thing {padding: 5px 10px 5px 10px!important;border-top-left-radius:3px!important;border-bottom-left-radius:3px!important;height:30px!important;font-size:12px!important; background:white!important; cursor: pointer;}']

})
export class DateRangePickerComponent implements OnInit {
    options : any;

    dateRangeInputHtml : any;

    @Input() startDate: Date;
    @Input() endDate: Date;
    @Input() disabled: boolean;
    @Output() valueChanged: EventEmitter<any> = new EventEmitter();
    @Output() search: EventEmitter<DateRange> = new EventEmitter<DateRange>();

    constructor(private elementRef: ElementRef) { }

    ngOnInit() {

       // this.endDate = new Date();
       // this.startDate = this.deductTwentyFourHours(this.endDate);

        this.options = {
            'locale': {
                'format': 'DD-MMM-YYYY'
            },
            'showDropdowns': true,
            'showWeekNumbers': true,
            'timePickerIncrement': 5,
            'autoApply': true,
            'startDate': this.formatDate(this.startDate),
            'endDate': this.formatDate(this.endDate)
        };

        this.dateRangeInputHtml = $(this.elementRef.nativeElement).children().children('input[name="datepicker"]');

        //via jquery select the input and intitialise the datepicker
        //datepicker will maintain daterange untill search clicked, 
        //then it will pas range back to caller
        this.dateRangeInputHtml.daterangepicker(this.options, null);

    }

    formatDate(dateToFormat : Date): string {
        let date1: Date
        if (typeof dateToFormat === 'undefined') {
            date1 = new Date();
        }
        else {
            date1 = new Date(dateToFormat.toString());
        }

        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        let month = months[date1.getMonth()];

        return date1.getDate() + '-' + month + '-' + date1.getFullYear();
    }


    onInputChange(event: any) {
       this.dateRangeInputHtml.data('daterangepicker').setStartDate(this.formatDate(this.startDate));
       this.dateRangeInputHtml.data('daterangepicker').setEndDate(this.formatDate(this.endDate));
    }


    searchRange()
    {
        // by design the picker will set the time of the date to 00:00 UTC time, hovever dateTime used in logic 
        // and in JSON serialisation is the LOCAL time, there for need to adjust time so that LOCAL time is 00:00  
        this.options;
        var drp = this.dateRangeInputHtml.data('daterangepicker');

        let startDate : Date = new Date(drp.startDate._d.toUTCString());
        //var minDiffToUtc = startDate.getTimezoneOffset(); 
        //startDate = new Date(startDate.getTime() -(minDiffToUtc*60000));

        let endDate : Date = new Date(drp.endDate._d.toUTCString());
        //var minDiffToUtc = endDate.getTimezoneOffset(); 
        //endDate = new Date(endDate.getTime() -(minDiffToUtc*60000));

        let message = new DateRange(startDate, endDate);
        this.search.emit(message);
    }
}


export class DateRange {
    startDate: Date;
    endDate: Date;

    constructor(startDate: Date, endDate: Date) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}