/* Created by Massimo Di Pierro (massimo.dipierro@gmail.com) -  License: BSD */

$.fn.calendar = function() {
    if(this.length>1)
        return this.each(function(){jQuery(this).calendar();});
    var ISO = '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}';
    var t = this;
    var s = jQuery('<input type="hidden"/>');
    var w = jQuery('<table class="cal-wrapper"/>');    
    var value = t.val();
    var date = Date.create(value);
    var start = t.data('start')||'Sunday';
    var format = t.data('format')||'{dd}/{MM}/{year} {hh}:{mm} {TT}';
    var format_time = format;
    if(format_time.indexOf('{year}')>=0)
        format_time = format_time.split(' ')[1];
    var timeout = null;
    var set = function() {s.val(t.val().trim().length&&date&&date.format(ISO)||'');};
    var update = (function() {date=Date.create(t.val()); redraw(true);}).debounce(100);
    var func = function(dt){return function(event){date=Date.create(q).advance(dt);redraw()};};
    var tr = function(x){return '<tr>'+x+'</tr>';}
    var td = function(x,c,d){return '<td'+(c&&(' class="cal-'+c+'"')||'')+(d&&(' colspan="'+d+'"')||'')+'>'+(x||'')+'</td>';}
    var q = date;
    var redraw = function(mute) {
        if(!mute) t.val(date.format(format));        
        if(t.is('.error')) t.removeClass('error');
        if(t.val().trim()=='') {
            set(); q=Date.create();
        } else if(date && date!='Invalid Date') { 
            set(); q=Date.create(date);
        } else { 
            t.addClass('error'); q=Date.create();
        }
        var row='', k=0, html='';
        var day = Date.create(q).set({day:1});
        while(!day.is(start)) day.advance({days:-1});
        var next = Date.create(q).advance({months:1}).set({days:7});
        while(!day.is(start)) next.advance({days:-1});
        if(format.indexOf('{year}')>=0) {
            html += tr(td('&laquo;','ym')+td('&lsaquo;','mm')+
                       td(q.format('{Mon} {year}'),'y',3)+
                       td('&rsaquo;','mp')+td('&raquo;','yp'));
            var tds = [0,1,2,3,4,5,6].map(function(n){
                    return td((n).daysAfter(start).format('{Dow}'));});
            html += tr(tds.join(''));
            while(day.isBefore(next)) {            
                if(k%7==0) row = '';
                if(day.is(q)) row+=td(day.format('{d}'),'selected');
                else if(day.getMonth()==q.getMonth()) row+=td(day.format('{d}'),'day');
                else row+=td('');
                day.advance({days:1}); 
                k++;
                if(k%7==0) html += tr(row);
            }            
        }
        if(format.indexOf('{hh}')>=0) {
            html += tr(td('&laquo;','Hm')+td('&lsaquo;','mim')+
                       td(q.format(format_time),'t',3)+
                       td('&rsaquo;','mip')+td('&raquo;','Hp'));
        }
        w.html(html).find('td').css({'text-align':'center'});
        w.find('.cal-ym').click(func({years:-1}));
        w.find('.cal-yp').click(func({years:+1}));
        w.find('.cal-mm').click(func({months:-1}));
        w.find('.cal-mp').click(func({months:+1}));
        w.find('.cal-Hm').click(func({hours:-1}));
        w.find('.cal-Hp').click(func({hours:+1}));
        w.find('.cal-mim').click(func({minutes:-5}));
        w.find('.cal-mip').click(func({minutes:+5}));
        w.find('.cal-day').click(function(){
                date = q;
                var d=parseInt(jQuery(this).text());date.set({day:d});redraw();
            });
        w.find('.cal-y,.cal-t,.cal-selected').css('font-weight','bold');
        jQuery('.cal-wrapper').not(w).hide();
        w.fadeIn();
    }
    var close = function(){
        set();
        if(timeout) clearTimeout(timeout);
        timeout = setTimeout(function(){ 
                console.log('checking:'+w.is(':hover'));
                if(w.find('td:hover').length==0) w.fadeOut(); }, 300);
    };
    t.removeAttr('name').after(s.prop('name',t.prop('name')));
    t.keyup(update).blur(close).click(redraw);
    jQuery('body').on('click',close);
    w.css({'position':'absolute',
                'z-index':3000,
                'cursor':'pointer',
                'top':(t.offset().top+t.height()+10)+'px',
                'left':(t.offset().left)+'px',
                'background':'white',
                'box-shadow':'0 0 12px #ddd'});
    t.val(date.format(format)).after(w);    
    set();
};

jQuery(function(){ jQuery('.date,.datetime,.time').calendar();});
