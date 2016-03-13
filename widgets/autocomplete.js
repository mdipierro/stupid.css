/* Created by Massimo Di Pierro (massimo.dipierro@gmail.com) -  License: BSD */

$.fn.autocomplete = function() {
    if(this.length>1)
        return this.each(function(){jQuery(this).autocomplete();});
    var _options=[],_callback=null;
    if(this.data('source').substr(0,4)=='url:') {
        $.getJSON(this.data('source').substr(4))
            .done(function(data){_options=data;});
    } else if(this.data('source').substr(0,7)=='search:') {
        _callback = this.data('source').substr(7);
    } else {
        try {
            _options = eval('('+(this.data('source')||[])+')');
        } catch(e) { 
            console.log('invalid source:'+this.data('source'));
        }
    }
    var self = this;
    if(self.data('has-widget'))return; else self.data('has-widget',1);
    var swap=function(x){var w=$('<input/>').addClass(x.attr('class')).attr('style',x.attr('style')).attr('placeholder',x.attr('placeholder')).addClass('has-widget');x.hide().after(w);return w;};
    var mode = this.data('mode')||'simple'; // 'chained' or 'keyed'
    var min_length = parseInt(this.data('min-length')||'2');
    var input = (mode=='keyed')?swap(self):self;
    _options.sort(function(a,b){
            return (a[0]<b[0])?(-1):((a[0]>b[0])?(+1):0);});
    var suggestion = input.clone().attr('placeholder','').hide();
    input.after(suggestion);
    var popup = jQuery('<ul class="autocomplete"/>').hide();    
    input.after(popup);
    input.focus(function(){
            popup.show();
            suggestion.show();
            suggestion.css({position:'absolute',
                        'z-index':1,
                        top:input.offset().top+'px',
                        left:input.offset().left+'px',
                        height:input.outerHeight()+'px',
                        color:'rgba(0,0,0,0.3)',
                        background:'transparent'});
    popup.css({'position':'absolute',
                'z-index':3000,
                'cursor':'pointer',
                'top':(input.offset().top+input.height()+10)+'px',
                'left':(input.offset().left)+'px',
                'width':input.width()+'px',
                'background':'white',
                'box-shadow':'0 0 12px #ddd'});
        });
    input.blur(function(){
            popup.fadeOut();
            suggestion.hide();
        });
    var p = 0;
    var get = function(){return input.val().split(/\s+/ig); }
    var cmp = function(a,b){
        a = a.toLowerCase();
        b = b.toLowerCase();
        return (a==b)?0:((a<b)?-1:+1);
    }
    var getval = function(item) {
        var keywords = get();
        var v;
        for(var k=0; k<keywords.length; k++) {
            v = keywords.slice(k).join(' ');
            if(cmp(v,item[0].substr(0,v.length))==0) break;
        }
        return input.val()+item[0].substr(v.length);
    };
    var select = function(item) {
        if(mode=='simple') {
            input.val(item[0]).change();            
        } else if(mode=='keyed') {
            input.val(item[0]);
            self.val(item[1]).change();
        } else if(mode=='chained') {
            input.val(getval(item));
        }
        p = 0;
        items = [];
    };
    var items = [];
    var tab = function(e) {
        if(e.keyCode==39 || e.keyCode==9) {                        
            if(items.length) {
                e.preventDefault();
                popup.hide();
                select(items[p]);
            }
        }
    };
    var keypress = function(e){                    
        if(_callback) {
            $.getJSON(_callback.assign(input.get()))
            .done(function(data){
                    _options=data;
                    handle_keypress(e);
                });
        } else handle_keypress(e);
        
    };
    var binary_search = function(v) {
        var imin=0, imax=_options.length;
        while(imax>imin) {
            var i = parseInt((imin+imax)/2);
            var s = _options[i][0].substr(0,v.length);
            var z = cmp(s,v);
            if(z==0) {
                while(i>imin) {
                    var s = _options[i-1][0].substr(0,v.length);
                    if(cmp(s,v)<0) return i;
                    i--;
                }
                return i;
            }
            else if(z<0) imin=i+1;
            else if(z>0) imax=i;
        }
        return -1;
    };
    var handle_keypress =  function(e) {
        var keywords = get();
        items = [];
        for(var k=0; k<keywords.length; k++) {
            var v = keywords.slice(k).join(' ');
            if(v.length>=min_length) {
                // find first match
                var i = binary_search(v);
                // find all following matches
                while(i>=0 && i<_options.length) {
                    var s = _options[i][0].substr(0,v.length);
                    if(cmp(s,v)==0) items.push(_options[i]);
                    else break;
                    i++;
                }
            }
        }
        items.sort();
        if(e.keyCode==13) {
            p = 0;
            popup.hide();
            return;
        } else if(e.keyCode==40) {
            event.preventDefault();
            p = p+1;
        } else if(e.keyCode==38) {
            event.preventDefault();
            p = p-1;
            // up
        } else if(e.keyCode==39 || e.keyCode==9) {
            return;
        }
        if(items.length) {
            p = Math.max(0,Math.min(p,items.length-1));
            suggestion.val(getval(items[p]));
            suggestion.show();
            popup.show().html('');
            for(var i=0;i<items.length;i++) {
                var li = '<li data-index="'+i+'">'+items[i][0]+'</li>';
                var q = jQuery(li);
                if(i==p) q.css('font-weight','bold');
                q.click((function(i){return function(){
                                select(items[i]);
                            };})(i));
                popup.append(q);
            }
        } else {
            suggestion.val('');
            popup.hide();
        }        
    };

    input.keyup(keypress).keydown(tab);
    $(window).on('resize',function(){
            suggestion.css({top:input.offset().top+'px',left:input.offset().left+'px'});
            popup.css({top:(input.offset().top+input.height()+10)+'px',left:input.offset().left+'px',width:input.width()+'px'});
        });
};

jQuery(function(){ jQuery('input.autocomplete').autocomplete();});
