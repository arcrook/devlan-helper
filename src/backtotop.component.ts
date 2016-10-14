import { Component, OnInit } from '@angular/core';

//File dependent on jquery ($)

@Component({
    moduleId: module.id,
    selector: 'backtotop',
    template: `<div [style.opacity]="opacity" 
                    (mouseenter)="opacity = 1"
                    (mouseout)="opacity = 0.7"
                    (click)="slide()"
                    class="slideToTop">
                    <i class="fa fa-chevron-up"
                        (mouseenter)="opacity = 1"
                        (mouseout)="opacity = 0.7"
                        (click)="slide()"></i>
                </div>` ,
    styles : [ '.slideToTop { position: fixed; bottom: 20px; right: 25px; width: 40px;height:40px; color: #eee;line-height:40px;text-align:center; background-color: #222d32;  cursor: pointer;border-radius: 5px;z-index: 99999;opacity: .7;display: none }' ] 
})
export class BackToTopComponent implements OnInit {
    
    opacity: number = 0.7;
    
    constructor() { }

    ngOnInit() { 
   
        var slideToTop = $(".slideToTop");
            
        $(window).scroll(function () {
            if ($(window).scrollTop() >= 150) {
                if (!$(slideToTop).is(':visible')) {
                    $(slideToTop).fadeIn(500);
                }
            } else {
                $(slideToTop).fadeOut(500);
            }
        });
    }

    slide(){
        $("body").animate({
                scrollTop: 0
            }, 500);
    }
}