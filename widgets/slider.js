/* Created by Massimo Di Pierro (massimo.dipierro@gmail.com) -  License: BSD */

$.fn.slider = function() {
    var t = this;
    var s = jQuery('<div/>');    
    var range = t.attr('data-range').split(',');
    var decimals = range[1]&&range[1].split('.')[1];
    decimals = decimals&&decimals.length||0;
    range = range.map(parseFloat);
    s.css({position:'absolute',
                'z-index':1,                
                top:t.offset().top+'px',
                left:t.offset().left+'px',
                height:t.outerHeight()+'px',
                'pointer-events':'none',
                background:'rgba(0,0,0,0.2)'});
    var left = parseInt(t.css('padding-left').replace('px',''));
    var right = parseInt(t.css('padding-right').replace('px',''));
    var update = (function(e){
            var shift = e.offsetX-t.offset().left+left+right;
            var percent = Math.max(0,Math.min(1.0,shift/(t.outerWidth())));
            var value = range[0]+percent*(range[1]-range[0]);
            if(range[2]) value=range[2]*Math.round(value/range[2]);
            if(t.is('.integer')) value = parseInt(value);
            else value=Math.round(value,decimals);            
            t.val(value);
            s.css({width:shift+'px'});
        }).throttle(10);
    var onchange = function(){
        if(t.val()) width=(t.outerWidth())*Math.max(0,Math.min(1,parseFloat(t.val())/(range[1]-range[0])));
        else width=0;
        s.css({width:width});    
    }
    onchange();
    t.keyup(onchange);
    t.dblclick(update);
    t.after(s);
    var isDragging=false;
    t.mousedown(function() {isDragging = true;});
    t.mousemove(function(e) {if(isDragging) update(e);});
    t.mouseup(function() {isDragging = false;});
};

jQuery(function(){ jQuery('.slider').slider(); });
