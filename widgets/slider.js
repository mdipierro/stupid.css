/* Created by Massimo Di Pierro (massimo.dipierro@gmail.com) -  License: BSD */

$.fn.slider = function() {
    if(this.length>1)
        return this.each(function(){$(this).slider();});
    var self = this;
    if(self.data('has-widget')) return; else self.data('has-widget',1);    var slider = $('<div/>');    
    var range = self.attr('data-range').split(',');
    var decimals = range[1]&&range[1].split('.')[1];
    decimals = decimals&&decimals.length||0;
    range = range.map(parseFloat);
    slider.css({position:'absolute',
                'z-index':1,                
                top:(self.offset().top+self.outerHeight()-5)+'px',
                left:self.offset().left+'px',
                height:5+'px',
                'pointer-events':'none',
                background:'rgba(0,0,0,0.2)'});
    var left = parseInt(self.css('padding-left').replace('px',''));
    var right = parseInt(self.css('padding-right').replace('px',''));
    var update = (function(e){
            var shift = e.offsetX;
            var percent = Math.max(0,Math.min(1.0,shift/(self.outerWidth())));
            var value = range[0]+percent*(range[1]-range[0]);
            if(range[2]) value=range[2]*Math.round(value/range[2]);
            if(self.is('.integer')) value = parseInt(value);
            else value=Math.round(value,decimals);            
            self.val(value).change();
            slider.css({width:shift+'px'});
        }).throttle(10);
    var onchange = function(){
        if(self.val()) width=(self.outerWidth())*Math.max(0,Math.min(1,parseFloat(self.val())/(range[1]-range[0])));
        else width=0;
        slider.css({width:width});    
    }
    onchange();
    self.keyup(onchange);
    self.dblclick(update);
    self.after(slider);
    var isDragging=false;
    self.mousedown(function() {isDragging = true;});
    self.mousemove(function(e) {if(isDragging) update(e);});    
    self.mouseout(function(e) {isDragging = false});
    self.mouseup(function() {isDragging = false;});    
    $(window).on('resize',function(){
            slider.css({top:(self.offset().top+self.outerHeight()-5)+'px', left:self.offset().left+'px'});
        });
};

$(function(){ $('input.slider').slider(); });
