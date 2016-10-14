import {Component, ElementRef, OnInit, Input, Output, EventEmitter} from '@angular/core';

//Talk to jquery
declare var $: any;

@Component({
    selector: 'DateRangePickerComponent',
    template: `  
    <input type="text" name="datepicker" class="form-control pull-right thing" placeholder="Search" 
                        (valueChanged)="onValueChanged($event)"
                        value="{{formatDate(startDate)}} - {{formatDate(endDate)}}"
                        [disabled]="disabled"/>
    `,
    styles: ['.thing {padding: 5px 10px 5px 10px!important;border-top-left-radius:3px!important;border-bottom-left-radius:3px!important;height:30px!important;font-size:12px!important;}']

})
export class DateRangePickerComponent implements OnInit {
    options : any;

    @Input() startDate: Date;
    @Input() endDate: Date;
    @Input() disabled: boolean;
    @Output() valueChanged: EventEmitter<any> = new EventEmitter();
    @Output() selected: EventEmitter<DateRange> = new EventEmitter<DateRange>();

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

        //via jquery select the input and intitialise the datepicker
        $(this.elementRef.nativeElement).children('input[name="datepicker"]')
            .daterangepicker(this.options, this.dateCallback.bind(this));

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
        $(this.elementRef.nativeElement).children('input[name="datepicker"]').data('daterangepicker').setStartDate(this.formatDate(this.startDate));
        $(this.elementRef.nativeElement).children('input[name="datepicker"]').data('daterangepicker').setEndDate(this.formatDate(this.endDate));
    }


    dateCallback(start: any, end: any, label: any) {
        // by design the picker will set the time of the date to 23:00 e.g. 2016-08-09T23:00:00.000Z
        // need to set this to 00:00
        let date: Date = new Date(start);
        date.setHours(0, 0, 0, 0);

        let date1: Date = new Date(end);
        date1.setHours(0, 0, 0, 0);

        let message = new DateRange(date, date1);
        this.selected.emit(message);
    }

    newGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
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