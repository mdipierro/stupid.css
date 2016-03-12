/* Created by Massimo Di Pierro (massimo.dipierro@gmail.com) -  License: BSD */
$.fn.calendar = function() {
    if(this.length>1)
        return this.each(function(){$(this).calendar();});

    var swap=function(x){var w = $('<input/>').addClass(x.attr('class')).attr('style',x.attr('style')); x.hide().after(w); return w;};
    
    var ISO = '{yyyy}-{MM}-{dd} {hh}:{mm}:{ss}';
    var self = this;
    var input = swap(self);
    var popup = $('<table class="cal-wrapper"/>');    
    var value = self.val();
    var date = Date.create(value);
    var start = input.data('start')||'Sunday';
    var format = input.data('format')||'{dd}/{MM}/{year} {hh}:{mm} {TT}';
    var format_time = format;
    if(format_time.indexOf('{year}')>=0)
        format_time = format_time.split(' ')[1];
    var timeout = null;
    var set = function() {self.val(input.val().trim().length&&date&&date.format(ISO)||'').change();};
    var update = (function() {date=Date.create(input.val());redraw(true);}).debounce(100);
    var func = function(dt){return function(e){
            e.stopPropagation();
            date=Date.create(q);
            if(dt['minutes']) 
                date.set({seconds:0,minutes:5*parseInt(date.getMinutes()/5)});
            date.advance(dt);redraw()
        };
    };
    var tr = function(x){return '<tr>'+x+'</tr>';}
    var td = function(x,c,d){return '<td'+(c&&(' class="cal-'+c+'"')||'')+(d&&(' colspan="'+d+'"')||'')+'>'+(x||'')+'</td>';}
    var q = date;
    var redraw = function(mute) {
        console.log(date);
        if(!mute) input.val(date.format(format));        
        if(input.is('.error')) input.removeClass('error');
        if(input.val().trim()=='') {
            set(); q=Date.create();
        } else if(date && date!='Invalid Date') { 
            set(); q=Date.create(date);
        } else { 
            input.addClass('error'); q=Date.create();
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
        popup.html(html).find('td').css({'text-align':'center'});
        popup.find('.cal-ym').click(func({years:-1}));
        popup.find('.cal-yp').click(func({years:+1}));
        popup.find('.cal-mm').click(func({months:-1}));
        popup.find('.cal-mp').click(func({months:+1}));
        popup.find('.cal-Hm').click(func({hours:-1}));
        popup.find('.cal-Hp').click(func({hours:+1}));
        popup.find('.cal-mim').click(func({minutes:-5}));
        popup.find('.cal-mip').click(func({minutes:+5}));
        popup.find('.cal-day').click(function(e){
                e.stopPropagation();
                date = q;
                var d=parseInt($(this).text());date.set({day:d});redraw();
            });
        popup.find('.cal-y,.cal-t,.cal-selected').css('font-weight','bold');
        $('.cal-wrapper').not(popup).hide();
        popup.fadeIn();        
    }
    var close = function(e){         
        var q = $(e.target);
        if(q.is('input')||q.closest('.cal-wrapper').length>0) return;
        set();
        if(timeout) clearTimeout(timeout);
        timeout = setTimeout(function(){ 
                if(popup.find('td:hover').length==0) popup.fadeOut(); }, 300);
    };
    input.keyup(update).blur(close).click(function(e){e.stopPropagation();redraw();});
    $('html').on('click',close);
    popup.click(function(e){e.stopPropagation();});
    popup.css({'position':'absolute',
                'z-index':3000,
                'top':(input.offset().top+input.height()+10)+'px',
                'left':(input.offset().left)+'px',
                'cursor':'pointer',
                'background':'white',
                'box-shadow':'0 0 12px #ddd'});
    input.val(date.format(format)).after(popup);    
    set();
};

$(function(){ $('.date,.datetime,.time').calendar();});
